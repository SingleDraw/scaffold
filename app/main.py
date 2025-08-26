from fastapi import FastAPI
from app.api import router
from app.middleware import auth_middleware


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    """
    app = FastAPI(
        title="FastAPI Example Service", 
        version="0.1.1"
    )

    # Add auth middleware
    app.middleware("http")(auth_middleware)

    app.include_router(router)

    return app


app = create_app()
