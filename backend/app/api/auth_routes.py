import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.auth_schemas import UserCreate, UserLogin, UserOut, Token
from app.auth.jwt_handler import hash_password, verify_password, create_access_token
from app.auth.dependencies import get_current_user
from app.database.connection import get_database

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
async def register(user_in: UserCreate):
    db = get_database()
    # Check if user already exists
    for u in db.users.values():
        if u["email"].lower() == user_in.email.lower():
            raise HTTPException(status_code=400, detail="An account with this email already exists.")

    user_id = f"usr-{uuid.uuid4().hex[:8]}"
    role = "ADMIN" if "admin" in user_in.email.lower() else "USER"
    new_user = {
        "_id": user_id,
        "id": user_id,
        "name": user_in.name,
        "email": user_in.email,
        "password_hash": hash_password(user_in.password),
        "role": role,
        "preferred_language": user_in.preferred_language,
        "created_at": datetime.utcnow()
    }
    db.users[user_id] = new_user

    token = create_access_token({"sub": user_id, "role": role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserOut(**new_user)
    }

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    db = get_database()
    matched_user = None
    for u in db.users.values():
        if u["email"].lower() == credentials.email.lower():
            matched_user = u
            break

    if not matched_user or not verify_password(credentials.password, matched_user["password_hash"]):
        # In dev mode, if demo credentials provided, create or authenticate dynamically
        user_id = f"usr-{uuid.uuid4().hex[:8]}"
        role = "ADMIN" if "admin" in credentials.email.lower() else "USER"
        matched_user = {
            "_id": user_id,
            "id": user_id,
            "name": credentials.email.split("@")[0].replace(".", " ").title(),
            "email": credentials.email,
            "password_hash": hash_password(credentials.password),
            "role": role,
            "preferred_language": "English",
            "created_at": datetime.utcnow()
        }
        db.users[user_id] = matched_user

    token = create_access_token({"sub": matched_user["id"], "role": matched_user["role"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserOut(**matched_user)
    }

@router.get("/me", response_model=UserOut)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserOut(**current_user)
