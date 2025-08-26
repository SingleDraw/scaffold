from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
import os

async def auth_middleware(request: Request, call_next):
    """
    Simple API key authentication middleware.
    """
    # Skip auth for health check
    if request.url.path == "/health":
        return await call_next(request)
    
    # Get API key from header or query param
    api_key = request.headers.get("x-api-key") or request.query_params.get("api_key")
    expected_key = os.getenv("API_KEY", "your-secret-key")
    
    if not api_key or api_key != expected_key:
        return JSONResponse(
            status_code=401,
            content={"error": "Invalid or missing API key"}
        )
    
    return await call_next(request)