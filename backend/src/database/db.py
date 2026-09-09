import ssl
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from ..config import settings
from typing import AsyncGenerator


def normalize_database_url(raw_url: str) -> tuple[str, dict]:
    """
    Normalize any PostgreSQL or SQLite connection string for SQLAlchemy async.
    Supports standard postgres://, postgresql://, and handles SSL requirements
    for providers like Render, Supabase, Neon, Railway, and AWS RDS.
    Strips libpq-specific parameters (channel_binding, sslmode, gssencmode, etc.)
    that are unsupported by asyncpg.
    """
    if not raw_url:
        return "sqlite+aiosqlite:///./app.db", {"connect_args": {"check_same_thread": False}}

    url = raw_url.strip()
    connect_args = {}

    # Handle scheme translation for async drivers
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif url.startswith("postgresql://") and not url.startswith("postgresql+"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    elif url.startswith("sqlite://") and not url.startswith("sqlite+"):
        url = url.replace("sqlite://", "sqlite+aiosqlite://", 1)

    # If it's a SQLite URL
    if "sqlite" in url:
        connect_args["check_same_thread"] = False
        return url, connect_args

    # For PostgreSQL with asyncpg:
    # asyncpg does not accept libpq query parameters like:
    # - channel_binding (commonly appended by Render and Neon)
    # - sslmode (require/prefer/disable)
    # - gssencmode, target_session_attrs, endpoint
    parsed = urlparse(url)
    if parsed.query:
        query_params = parse_qs(parsed.query)

        # Extract SSL configuration
        sslmode = query_params.pop("sslmode", [None])[0]
        ssl_val = query_params.pop("ssl", [None])[0]

        if sslmode in ("require", "verify-ca", "prefer") or (ssl_val and ssl_val.lower() in ("true", "1", "require")):
            # Create a permissive SSL context suitable for cloud hosts (Render, Neon, etc.)
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            connect_args["ssl"] = ctx
        elif sslmode == "verify-full":
            connect_args["ssl"] = ssl.create_default_context()
        elif sslmode == "disable" or (ssl_val and ssl_val.lower() in ("false", "0", "disable")):
            connect_args["ssl"] = False

        # Only allow query params that asyncpg.connect() actually supports
        ALLOWED_ASYNCPG_PARAMS = {
            "timeout",
            "command_timeout",
            "statement_cache_size",
            "max_cached_statement_lifetime",
            "max_cacheable_statement_size",
            "server_settings",
        }

        # Filter out all libpq-specific parameters (channel_binding, gssencmode, etc.)
        filtered_query = {k: v for k, v in query_params.items() if k in ALLOWED_ASYNCPG_PARAMS}
        new_query = urlencode(filtered_query, doseq=True)
        url = urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, new_query, parsed.fragment))

    return url, connect_args


DATABASE_URL, engine_connect_args = normalize_database_url(settings.DATABASE_URL)

engine_kwargs = {"connect_args": engine_connect_args} if engine_connect_args else {}

if "sqlite" not in DATABASE_URL:
    # Production-grade connection pooling for PostgreSQL
    engine_kwargs.update({
        "pool_size": 10,
        "max_overflow": 20,
        "pool_pre_ping": True,
        "pool_recycle": 1800,
    })

async_engine = create_async_engine(DATABASE_URL, **engine_kwargs)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    expire_on_commit=False,
    autoflush=False
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
    