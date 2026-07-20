from fastapi import Header, HTTPException
from database import is_valid_key

async def verify_api_key(x_api_key: str = Header(...)):
    if not is_valid_key(x_api_key):
        raise HTTPException(status_code=401, detail="Invalid or missing API key")
    return x_api_key
