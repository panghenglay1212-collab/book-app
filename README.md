# Book App

A full-stack book tracker with user accounts.

## Features
- Register and login (JWT)
- Add, edit, delete, and search your own books
- Each user sees only their own books

## Tech stack
- Backend: FastAPI, SQLAlchemy, PostgreSQL
- Frontend: React, Tailwind CSS

## Run the backend
```bash
cd book-api
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```
Copy `.env.example` to `.env` and fill in your values, then:
```bash
uvicorn main:app --reload
```

## Run the frontend
```bash
cd book-frontend
npm install
npm run dev
```