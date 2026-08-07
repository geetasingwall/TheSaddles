from __future__ import annotations
from typing import Any, Dict, Optional
from fastapi.responses import JSONResponse


def success_response(data: Any = None, message: str = "Success", status_code: int = 200) -> JSONResponse:
    return JSONResponse(status_code=status_code, content={"success": True, "message": message, "data": data})


def error_response(message: str, status_code: int = 400, error_code: Optional[str] = None) -> JSONResponse:
    body: Dict[str, Any] = {"success": False, "message": message}
    if error_code:
        body["error_code"] = error_code
    return JSONResponse(status_code=status_code, content=body)
