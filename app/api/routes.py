import datetime
from fastapi import APIRouter, File, UploadFile, Form, Header, Cookie, Request, HTTPException
from typing import Optional, List
from app.services import append_debug_log



router = APIRouter()



@router.post("/process")
async def process_request(
    request: Request,
    # Optional file(s)
    file: Optional[UploadFile] = File(None),
    files: Optional[List[UploadFile]] = File(None),
    # Example form fields
    param1: Optional[str] = Form(None),
    param2: Optional[int] = Form(None),
    # Headers
    user_agent: Optional[str] = Header(None),
    x_custom_header: Optional[str] = Header(None),
    # Cookies
    session_id: Optional[str] = Cookie(None),
):
    """
    Process incoming requests with various data types and log details.
    """
    try:

        # # 🔹 Headers & Cookies
        headers = dict(request.headers)
        cookies = request.cookies

        # 🔹 Detect body type
        content_type = request.headers.get("content-type", "")
        
        body_data = None

        if "application/json" in content_type:
            body_data = await request.json()
        elif "application/x-www-form-urlencoded" in content_type:
            body_data = await request.form()
        elif "multipart/form-data" in content_type:
            # file and Form fields are already captured above
            body_data = await request.form()
        else:
            # fallback: raw bytes
            body_data = await request.body()
    


        # 🔹 File handling
        file_info = []
        if file:
            content = await file.read()  # careful: loads into RAM
            file_info.append({"filename": file.filename, "size": len(content)})
        if files:
            for f in files:
                content = await f.read()
                file_info.append({"filename": f.filename, "size": len(content)})

        # 🔹 Build log entry
        log_entry = {
            "timestamp": datetime.datetime.now().isoformat(),
            "client_host": request.client.host if request.client else None,
            "form_params": {"param1": param1, "param2": param2},
            "headers": headers,
            "cookies": cookies,
            "user_agent": user_agent,
            "x_custom_header": x_custom_header,
            "raw_body_size": len(body_data) if body_data else 0,
            "files": file_info,
            "session_id": session_id,
        }

        # Append log entry to debug log
        append_debug_log(log_entry)


        return {
            "message": "Request processed",
            "logged": True,
            "files": file_info,
            "body_size": len(body_data) if body_data else 0,
            "body_data": str(body_data)[:200],  # first 200 chars
            "form_params": {"param1": param1, "param2": param2},
            "user_agent": user_agent,
            "x_custom_header": x_custom_header,
            "session_id": session_id,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")



@router.get("/debug")
def debug_sink():
    """
    Debugging endpoint to check sink directory.
    """
    from app.config import settings
    return {"sink_dir": settings.sink_dir}



@router.get("/health")
def health():
    """
    Health check endpoint.
    """
    return {"status": "ok"}
