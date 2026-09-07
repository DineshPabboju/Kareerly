from contextlib import asynccontextmanager
from tkinter.tix import Tree
from .database import async_engine
from fastapi import FastAPI
from .api.v1 import job_application_router, auth_router, user_router
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app:FastAPI):
    yield
    await async_engine.dispose()
    


app = FastAPI(lifespan=lifespan, version="1.0.0", 
              title="Kareerly-Job Kanban Board", 
              description="API for managing job applications in a Kanban board format.")

@app.get("/")
def message():
    return {"Message" : "Hello world"}

origins = ["http://localhost:5173"]
app.add_middleware(CORSMiddleware,
                   allow_origins = origins,
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"]
                   )


app.include_router(job_application_router)
app.include_router(auth_router)
app.include_router(auth_router)

