from contextlib import asynccontextmanager
from .database import async_engine
from .database.base import Base
from . import models  # noqa: F401 - Register models with metadata
from fastapi import FastAPI
from .api.v1 import job_application_router, auth_router, user_router
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Automatically create tables in PostgreSQL or SQLite if they don't exist
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await async_engine.dispose()


app = FastAPI(
    lifespan=lifespan,
    version="1.0.0",
    title="Kareerly-Job Kanban Board",
    description="API for managing job applications in a Kanban board format."
)

@app.get("/")
def message():
    return {"Message": "Kareerly Job Kanban Board API is running"}

from .config import settings

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
]
if settings.FRONTEND_URL and settings.FRONTEND_URL not in origins:
    origins.append(settings.FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(job_application_router)
app.include_router(auth_router)
app.include_router(user_router)

