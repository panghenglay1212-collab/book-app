from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Book, User
from schemas import BookCreate, BookOut
from dependencies import get_current_user

router = APIRouter(prefix="/books", tags=["books"])

@router.get("", response_model=list[BookOut])
def get_books(search: str | None = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Book)
    if search:
        query = query.filter(Book.title.ilike(f"%{search}%"))
    return query.all()

@router.get("/{book_id}", response_model=BookOut)
def get_book(book_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(404, "Book Not found")
    return book

@router.post("",  response_model=BookOut, status_code=201)
def create_book(data: BookCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    book = Book(**data.model_dump(), user_id=current_user.id)
    db.add(book)
    db.commit()
    db.refresh(book)
    return book

@router.put("/{book_id}",  response_model=BookOut)
def update_book(book_id: int, data: BookCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(404, "Book not found")
    book.title = data.title
    book.author = data.author
    book.is_read = data.is_read
    db.commit()
    db.refresh(book)
    return book

@router.delete("/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    book = db.get(Book, book_id)
    if not book:
            raise HTTPException(404, "Book not found")
    db.delete(book)
    db.commit()
    return {"message": "Deleted"}