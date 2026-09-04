from contextlib import asynccontextmanager
from .database import async_engine
from fastapi import FastAPI
from .api.v1 import job_application_router, auth_router, user_router
@asynccontextmanager
async def lifespan(app:FastAPI):
    yield
    await async_engine.dispose()
    


app = FastAPI(lifespan=lifespan, version="1.0.0", title="Kareerly-Job Kanban Board", description="API for managing job applications in a Kanban board format.")
app.include_router(job_application_router)
app.include_router(auth_router)
app.include_router(auth_router)

