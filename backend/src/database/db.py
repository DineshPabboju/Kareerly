from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from ..config import settings
from typing import AsyncGenerator


def normalize_database_url(raw_url: str) -> tuple[str, dict]:
    """
    Normalize any PostgreSQL or SQLite connection string for SQLAlchemy async.
    Supports standard postgres://, postgresql://, and handles SSL requirements
    for providers like Supabase, Neon, Render, Railway, and AWS RDS.
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

    # For PostgreSQL with asyncpg, asyncpg doesn't parse 'sslmode' query params directly.
    # Convert 'sslmode' into asyncpg compatible connect_args.
    parsed = urlparse(url)
    if parsed.query:
        query_params = parse_qs(parsed.query)
        if "sslmode" in query_params:
            sslmode = query_params.pop("sslmode")[0]
            if sslmode in ("require", "verify-ca", "verify-full"):
                connect_args["ssl"] = True
        if "ssl" in query_params:
            ssl_val = query_params.pop("ssl")[0]
            if ssl_val.lower() in ("true", "1", "require"):
                connect_args["ssl"] = True
        # Reconstruct URL without unsupported asyncpg query params
        new_query = urlencode(query_params, doseq=True)
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
    