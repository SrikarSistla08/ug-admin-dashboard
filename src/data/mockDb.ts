import { Communication, DirectoryStudent, Interaction, Note, Student, Task } from "@/domain/types";

// Simple in-memory mock DB for local demo
class MockDb {
  private students: Map<string, Student> = new Map();
  private interactions: Map<string, Interaction[]> = new Map();
  private communications: Map<string, Communication[]> = new Map();
  private notes: Map<string, Note[]> = new Map();
  private tasks: Map<string, Task[]> = new Map();

  upsertStudent(student: Student) {
    this.students.set(student.id, student);
  }

  listStudents(): DirectoryStudent[] {
    return Array.from(this.students.values()).map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      country: s.country,
      status: s.status,
      lastActiveAt: s.lastActiveAt,
    }));
  }

  listStudentsFull(): Student[] {
    return Array.from(this.students.values());
  }

  getStudent(id: string): Student | undefined {
    return this.students.get(id);
  }

  updateStudent(id: string, updates: Partial<Student>) {
    const existing = this.students.get(id);
    if (!existing) return;
    const merged: Student = { ...existing, ...updates };
    this.students.set(id, merged);
  }

  addInteraction(record: Interaction) {
    const list = this.interactions.get(record.studentId) ?? [];
    list.push(record);
    this.interactions.set(record.studentId, list);
  }

  listInteractions(studentId: string): Interaction[] {
    return this.interactions.get(studentId) ?? [];
  }

  addCommunication(record: Communication) {
    const list = this.communications.get(record.studentId) ?? [];
    list.push(record);
    this.communications.set(record.studentId, list);
  }

  listCommunications(studentId: string): Communication[] {
    return this.communications.get(studentId) ?? [];
  }

  addNote(record: Note) {
    const list = this.notes.get(record.studentId) ?? [];
    list.push(record);
    this.notes.set(record.studentId, list);
  }

  listNotes(studentId: string): Note[] {
    return this.notes.get(studentId) ?? [];
  }

  deleteNote(studentId: string, noteId: string) {
    const list = this.notes.get(studentId) ?? [];
    this.notes.set(
      studentId,
      list.filter((n) => n.id !== noteId)
    );
  }

  addTask(record: Task) {
    const list = this.tasks.get(record.studentId) ?? [];
    list.push(record);
    this.tasks.set(record.studentId, list);
  }

  listTasks(studentId: string): Task[] {
    return this.tasks.get(studentId) ?? [];
  }

  deleteTask(studentId: string, taskId: string) {
    const list = this.tasks.get(studentId) ?? [];
    this.tasks.set(
      studentId,
      list.filter((t) => t.id !== taskId)
    );
  }

  deleteCommunication(studentId: string, commId: string) {
    const list = this.communications.get(studentId) ?? [];
    this.communications.set(
      studentId,
      list.filter((c) => c.id !== commId)
    );
  }
}

export const mockDb = new MockDb();

(() => {
  const now = new Date();
  const students: Student[] = [
    {
      id: "stu_001",
      name: "Ava Johnson",
      email: "ava@example.com",
      phone: "+1-555-123-4567",
      grade: "12",
      country: "USA",
      status: "Exploring",
      lastActiveAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      flags: { notContacted7d: false, highIntent: true },
    },
    {
      id: "stu_002",
      name: "Rohan Patel",
      email: "rohan@example.com",
      phone: "+91-90000-00000",
      grade: "11",
      country: "India",
      status: "Shortlisting",
      lastActiveAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
      flags: { notContacted7d: true, needsEssayHelp: true },
    },
    {
      id: "stu_003",
      name: "Sara Chen",
      email: "sara@example.com",
      phone: "+65-8000-0000",
      grade: "12",
      country: "Singapore",
      status: "Applying",
      lastActiveAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      flags: { highIntent: true },
    },
    {
      id: "stu_004",
      name: "Miguel Torres",
      email: "miguel@example.com",
      phone: "+52-55-1234-5678",
      grade: "12",
      country: "Mexico",
      status: "Submitted",
      lastActiveAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      flags: { highIntent: true },
    },
    {
      id: "stu_005",
      name: "Emma Smith",
      email: "emma@example.co.uk",
      phone: "+44-20-7000-0000",
      grade: "11",
      country: "United Kingdom",
      status: "Exploring",
      lastActiveAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
      flags: { notContacted7d: true },
    },
    {
      id: "stu_006",
      name: "Li Wei",
      email: "liwei@example.cn",
      phone: "+86-10-8888-0000",
      grade: "12",
      country: "China",
      status: "Shortlisting",
      lastActiveAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
      flags: { needsEssayHelp: true },
    },
    {
      id: "stu_007",
      name: "Priya Singh",
      email: "priya@example.in",
      phone: "+91-98-7654-3210",
      grade: "12",
      country: "India",
      status: "Applying",
      lastActiveAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
      flags: { highIntent: true },
    },
    {
      id: "stu_008",
      name: "Noah Williams",
      email: "noah@example.ca",
      phone: "+1-604-555-0000",
      grade: "11",
      country: "Canada",
      status: "Submitted",
      lastActiveAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
    },
    {
      id: "stu_009",
      name: "Hana Kim",
      email: "hana@example.kr",
      phone: "+82-2-555-7777",
      grade: "12",
      country: "South Korea",
      status: "Exploring",
      lastActiveAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
      flags: { notContacted7d: true },
    },
    {
      id: "stu_010",
      name: "Luca Rossi",
      email: "luca@example.it",
      phone: "+39-06-1234-5678",
      grade: "12",
      country: "Italy",
      status: "Shortlisting",
      lastActiveAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000),
      flags: { needsEssayHelp: true },
    },
  ];

  students.forEach((s) => mockDb.upsertStudent(s));

  // Seed simple interaction history for a few students
  const days = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);
  const interactions: Interaction[] = [
    { id: "int_001", studentId: "stu_001", type: "login", createdAt: days(1) },
    { id: "int_002", studentId: "stu_001", type: "ai_question", metadata: { q: "How to shortlist colleges?" }, createdAt: days(2) },
    { id: "int_003", studentId: "stu_001", type: "document_upload", metadata: { name: "Transcript.pdf" }, createdAt: days(3) },
    { id: "int_004", studentId: "stu_003", type: "login", createdAt: days(1) },
    { id: "int_005", studentId: "stu_003", type: "document_upload", metadata: { name: "Essay_draft.docx" }, createdAt: days(2) },
    { id: "int_006", studentId: "stu_007", type: "ai_question", metadata: { q: "CommonApp tips" }, createdAt: days(1) },
  ];
  interactions.forEach((i) => mockDb.addInteraction(i));
})();


