from fastapi import HTTPException, Header, Depends
from typing import Optional
from database import get_supabase

def get_current_user(authorization: Optional[str] = Header(None)):
    supabase = get_supabase()
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing authorization header")

    token = authorization.split(" ")[1]
    try:
        # Verify token with Supabase
        user = supabase.auth.get_user(token)
        if not user or not user.user:
            raise HTTPException(status_code=401, detail="Invalid session")
        return user.user
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
