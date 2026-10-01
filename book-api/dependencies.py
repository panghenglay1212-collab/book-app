import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
from models import User
from security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
) -> User:
    try:
        user_id = decode_access_token(token)
    except jwt.PyJWKError:
        raise HTTPException(401, "Invalid or expired token")

    user = db.get(User, user_id)
    if not user:
        raise HTTPException(401, "User not found")
    return user