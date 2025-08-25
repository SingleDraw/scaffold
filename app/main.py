from fastapi import FastAPI
from app.api import router


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    """
    app = FastAPI(
        title="FastAPI Example Service", 
        version="0.1.0"
    )

    app.include_router(router)

    return app


app = create_app()
