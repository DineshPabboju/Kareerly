from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from ..config import settings
from typing import  AsyncGenerator


async_engine = create_async_engine(settings.DATABASE_URL)

AsyncSessionLocal = async_sessionmaker(bind=async_engine)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
    