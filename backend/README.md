# Undergraduation Admin API - Python FastAPI Backend

A production-ready FastAPI backend for the Undergraduation Admin Dashboard.

## Features

- **FastAPI** - Modern, fast web framework for building APIs
- **Firebase Integration** - Real-time database with Firestore
- **CORS Support** - Cross-origin requests for frontend integration
- **Pydantic Models** - Type-safe data validation
- **RESTful API** - Clean, RESTful endpoints
- **Error Handling** - Comprehensive error handling and validation

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/{student_id}` - Get specific student
- `PUT /api/students/{student_id}` - Update student

### Interactions
- `GET /api/students/{student_id}/interactions` - Get student interactions
- `POST /api/students/{student_id}/interactions` - Create interaction

### Communications
- `GET /api/students/{student_id}/communications` - Get communications
- `POST /api/students/{student_id}/communications` - Create communication
- `POST /api/followup` - Send follow-up email

### Notes
- `GET /api/students/{student_id}/notes` - Get notes
- `POST /api/students/{student_id}/notes` - Create note
- `DELETE /api/notes/{note_id}` - Delete note

### Tasks
- `GET /api/students/{student_id}/tasks` - Get tasks
- `POST /api/students/{student_id}/tasks` - Create task
- `DELETE /api/tasks/{task_id}` - Delete task

## Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Firebase Setup
1. Create a Firebase project
2. Download service account key as `serviceAccountKey.json`
3. Place in the backend directory

### 3. Environment Variables
Create a `.env` file:
```env
FIREBASE_PROJECT_ID=your-project-id
CUSTOMER_IO_API_KEY=your-customer-io-key
CUSTOMER_IO_SITE_ID=your-site-id
```

### 4. Run the Server
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Production Deployment

### Using Docker
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Using Railway/Heroku
```bash
# Install dependencies
pip install -r requirements.txt

# Run with gunicorn for production
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```

## Integration with Frontend

The frontend can be configured to use this Python backend by updating the API base URL:

```typescript
// In your frontend config
const API_BASE_URL = 'http://localhost:8000/api';
```

## Firebase Collections

The API expects the following Firestore collections:
- `students` - Student profiles
- `interactions` - Student interactions
- `communications` - Communication logs
- `notes` - Internal notes
- `tasks` - Task management

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

Error responses include detailed error messages for debugging.
