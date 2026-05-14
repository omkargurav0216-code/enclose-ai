# EncloseAI

AI-assisted procedural electronics enclosure generator.

## Tech Stack

Frontend:
- React
- Vite
- TypeScript

Backend:
- FastAPI
- Pydantic

---

## Backend Setup

cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload

Backend runs on:
http://127.0.0.1:8000

---

## Frontend Setup

cd frontend

npm install

npm run dev

Frontend runs on:
http://localhost:5173