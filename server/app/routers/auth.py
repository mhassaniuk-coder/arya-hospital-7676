from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.schemas.schemas import UserCreate, UserLogin, UserOut, Token
from app.middleware.auth import hash_password, verify_password, create_access_token, get_current_user
import uuid

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=Token)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == data.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        id=str(uuid.uuid4()),
        name=data.name,
        email=data.email,
        hashed_password=hash_password(data.password),
        role=data.role,
        avatar=f"https://ui-avatars.com/api/?name={data.name.replace(' ', '+')}&background=0D9488&color=fff",
    )
    db.add(user)
    await db.flush()

    token = create_access_token({"sub": user.id, "role": user.role})
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=Token)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.id, "role": user.role})
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
async def me(user: User = Depends(get_current_user)):
    return UserOut.model_validate(user)
