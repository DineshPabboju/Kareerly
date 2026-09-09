from contextlib import asynccontextmanager
from .database import async_engine
from .database.base import Base
from . import models  # noqa: F401 - Register models with metadata
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
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


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)}
    )

@app.get("/")
def message():
    return {"Message": "folio Job Kanban Board API is running"}

from .config import settings

origins = [
    "https://folio-job-track.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
]

if settings.FRONTEND_URL:
    for frontend_url in settings.FRONTEND_URL.split(","):
        cleaned = frontend_url.strip().rstrip("/")
        if cleaned and cleaned not in origins:
            origins.append(cleaned)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$|^https:\/\/.*\.onrender\.com$|^http:\/\/localhost(:\d+)?$|^http:\/\/127\.0\.0\.1(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(job_application_router)
app.include_router(auth_router)
app.include_router(user_router)

