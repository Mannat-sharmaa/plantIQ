from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.auth.jwt_handler import decode_access_token
from app.database.connection import get_database

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    db = get_database()
    default_user = list(db.users.values())[0]

    # If no token provided or demo mock token, return default user
    if not token or token.startswith("mock_jwt"):
        return default_user

    payload = decode_access_token(token)
    if payload is None:
        # Dev/demo mode: fallback instead of blocking
        return default_user

    user_id: str = payload.get("sub")
    if user_id is None:
        return default_user

    user = db.users.get(user_id)
    if user is None:
        return default_user

    return user

async def get_current_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required"
        )
    return current_user
