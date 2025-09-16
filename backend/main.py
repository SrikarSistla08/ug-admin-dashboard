from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime
import uvicorn

# Initialize FastAPI app
app = FastAPI(title="Undergraduation Admin API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    # Use service account key or default credentials
    if os.path.exists("serviceAccountKey.json"):
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
    else:
        # Use default credentials (for production with proper IAM)
        firebase_admin.initialize_app()

db = firestore.client()

# Pydantic models
class Student(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    grade: Optional[str] = None
    country: str
    status: str
    last_active_at: datetime
    created_at: datetime
    flags: Optional[List[str]] = []

class Interaction(BaseModel):
    id: str
    student_id: str
    type: str
    metadata: Optional[dict] = {}
    created_at: datetime

class Communication(BaseModel):
    id: str
    student_id: str
    channel: str
    subject: Optional[str] = None
    body: str
    created_at: datetime
    created_by: str

class Note(BaseModel):
    id: str
    student_id: str
    content: str
    created_at: datetime
    created_by: str

class Task(BaseModel):
    id: str
    student_id: str
    title: str
    due_at: Optional[datetime] = None
    status: str
    assignee: str
    created_at: datetime

class FollowUpRequest(BaseModel):
    student_id: str
    subject: Optional[str] = None
    body: str

# API Routes

@app.get("/")
async def root():
    return {"message": "Undergraduation Admin API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

# Students endpoints
@app.get("/api/students", response_model=List[Student])
async def get_students():
    """Get all students"""
    try:
        students_ref = db.collection('students')
        docs = students_ref.stream()
        
        students = []
        for doc in docs:
            data = doc.to_dict()
            students.append(Student(
                id=doc.id,
                name=data['name'],
                email=data['email'],
                phone=data.get('phone'),
                grade=data.get('grade'),
                country=data['country'],
                status=data['status'],
                last_active_at=data['lastActiveAt'],
                created_at=data['createdAt'],
                flags=data.get('flags', [])
            ))
        
        return students
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/students/{student_id}", response_model=Student)
async def get_student(student_id: str):
    """Get a specific student by ID"""
    try:
        doc_ref = db.collection('students').document(student_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Student not found")
        
        data = doc.to_dict()
        return Student(
            id=doc.id,
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            grade=data.get('grade'),
            country=data['country'],
            status=data['status'],
            last_active_at=data['lastActiveAt'],
            created_at=data['createdAt'],
            flags=data.get('flags', [])
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/students/{student_id}")
async def update_student(student_id: str, student: Student):
    """Update a student"""
    try:
        doc_ref = db.collection('students').document(student_id)
        doc_ref.set({
            'name': student.name,
            'email': student.email,
            'phone': student.phone,
            'grade': student.grade,
            'country': student.country,
            'status': student.status,
            'lastActiveAt': student.last_active_at,
            'createdAt': student.created_at,
            'flags': student.flags
        })
        
        return {"message": "Student updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Interactions endpoints
@app.get("/api/students/{student_id}/interactions", response_model=List[Interaction])
async def get_student_interactions(student_id: str):
    """Get interactions for a specific student"""
    try:
        interactions_ref = db.collection('interactions')
        query = interactions_ref.where('studentId', '==', student_id).order_by('createdAt', direction=firestore.Query.DESCENDING)
        docs = query.stream()
        
        interactions = []
        for doc in docs:
            data = doc.to_dict()
            interactions.append(Interaction(
                id=doc.id,
                student_id=data['studentId'],
                type=data['type'],
                metadata=data.get('metadata', {}),
                created_at=data['createdAt']
            ))
        
        return interactions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/students/{student_id}/interactions")
async def create_interaction(student_id: str, interaction: Interaction):
    """Create a new interaction for a student"""
    try:
        interactions_ref = db.collection('interactions')
        interactions_ref.add({
            'studentId': student_id,
            'type': interaction.type,
            'metadata': interaction.metadata,
            'createdAt': interaction.created_at
        })
        
        return {"message": "Interaction created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Communications endpoints
@app.get("/api/students/{student_id}/communications", response_model=List[Communication])
async def get_student_communications(student_id: str):
    """Get communications for a specific student"""
    try:
        communications_ref = db.collection('communications')
        query = communications_ref.where('studentId', '==', student_id).order_by('createdAt', direction=firestore.Query.DESCENDING)
        docs = query.stream()
        
        communications = []
        for doc in docs:
            data = doc.to_dict()
            communications.append(Communication(
                id=doc.id,
                student_id=data['studentId'],
                channel=data['channel'],
                subject=data.get('subject'),
                body=data['body'],
                created_at=data['createdAt'],
                created_by=data['createdBy']
            ))
        
        return communications
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/students/{student_id}/communications")
async def create_communication(student_id: str, communication: Communication):
    """Create a new communication for a student"""
    try:
        communications_ref = db.collection('communications')
        communications_ref.add({
            'studentId': student_id,
            'channel': communication.channel,
            'subject': communication.subject,
            'body': communication.body,
            'createdAt': communication.created_at,
            'createdBy': communication.created_by
        })
        
        return {"message": "Communication created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Follow-up endpoint
@app.post("/api/followup")
async def send_followup(followup: FollowUpRequest):
    """Send a follow-up email to a student"""
    try:
        # Here you would integrate with Customer.io or your email service
        # For now, we'll just log it and create a communication record
        
        # Create communication record
        communications_ref = db.collection('communications')
        communications_ref.add({
            'studentId': followup.student_id,
            'channel': 'email',
            'subject': followup.subject or 'Follow-up',
            'body': followup.body,
            'createdAt': datetime.now(),
            'createdBy': 'system'
        })
        
        # In a real implementation, you would call Customer.io API here
        # customer_io_service.send_email(followup.student_id, {
        #     'subject': followup.subject or 'Follow-up',
        #     'body': followup.body
        # })
        
        return {"message": "Follow-up email sent successfully", "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Notes endpoints
@app.get("/api/students/{student_id}/notes", response_model=List[Note])
async def get_student_notes(student_id: str):
    """Get notes for a specific student"""
    try:
        notes_ref = db.collection('notes')
        query = notes_ref.where('studentId', '==', student_id).order_by('createdAt', direction=firestore.Query.DESCENDING)
        docs = query.stream()
        
        notes = []
        for doc in docs:
            data = doc.to_dict()
            notes.append(Note(
                id=doc.id,
                student_id=data['studentId'],
                content=data['content'],
                created_at=data['createdAt'],
                created_by=data['createdBy']
            ))
        
        return notes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/students/{student_id}/notes")
async def create_note(student_id: str, note: Note):
    """Create a new note for a student"""
    try:
        notes_ref = db.collection('notes')
        notes_ref.add({
            'studentId': student_id,
            'content': note.content,
            'createdAt': note.created_at,
            'createdBy': note.created_by
        })
        
        return {"message": "Note created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/notes/{note_id}")
async def delete_note(note_id: str):
    """Delete a note"""
    try:
        db.collection('notes').document(note_id).delete()
        return {"message": "Note deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Tasks endpoints
@app.get("/api/students/{student_id}/tasks", response_model=List[Task])
async def get_student_tasks(student_id: str):
    """Get tasks for a specific student"""
    try:
        tasks_ref = db.collection('tasks')
        query = tasks_ref.where('studentId', '==', student_id).order_by('createdAt', direction=firestore.Query.DESCENDING)
        docs = query.stream()
        
        tasks = []
        for doc in docs:
            data = doc.to_dict()
            tasks.append(Task(
                id=doc.id,
                student_id=data['studentId'],
                title=data['title'],
                due_at=data.get('dueAt'),
                status=data['status'],
                assignee=data['assignee'],
                created_at=data['createdAt']
            ))
        
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/students/{student_id}/tasks")
async def create_task(student_id: str, task: Task):
    """Create a new task for a student"""
    try:
        tasks_ref = db.collection('tasks')
        tasks_ref.add({
            'studentId': student_id,
            'title': task.title,
            'dueAt': task.due_at,
            'status': task.status,
            'assignee': task.assignee,
            'createdAt': task.created_at
        })
        
        return {"message": "Task created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: str):
    """Delete a task"""
    try:
        db.collection('tasks').document(task_id).delete()
        return {"message": "Task deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
