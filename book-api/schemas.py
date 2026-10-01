from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class BookCreate(BaseModel):
    title: str
    author: str
    is_read: bool = False

class BookOut(BookCreate):
    id: int
    class Config:
        from_attributes = True
    