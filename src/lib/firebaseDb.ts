import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  Timestamp,
  increment 
} from 'firebase/firestore';
import { db } from './firebase';
import { Student, Interaction, Communication, Note, Task, DirectoryStudent } from '@/domain/types';

// Convert Firestore timestamps to Date objects
const convertTimestamp = (timestamp: unknown): Date => {
  if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp && typeof (timestamp as Record<string, unknown>).toDate === 'function') {
    return (timestamp as { toDate: () => Date }).toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp as string | number);
};

// Convert Date objects to Firestore timestamps
const toTimestamp = (date: Date) => Timestamp.fromDate(date);

export class FirebaseDb {
  // Students
  async upsertStudent(student: Student): Promise<void> {
    const studentRef = doc(db, 'students', student.id);
    const studentData = {
      ...student,
      lastActiveAt: toTimestamp(student.lastActiveAt),
      createdAt: toTimestamp(student.createdAt),
    };
    await setDoc(studentRef, studentData);
  }

  async listStudents(): Promise<DirectoryStudent[]> {
    const studentsRef = collection(db, 'students');
    const snapshot = await getDocs(studentsRef);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        country: data.country,
        status: data.status,
        lastActiveAt: convertTimestamp(data.lastActiveAt),
      };
    });
  }

  async listStudentsFull(): Promise<Student[]> {
    const studentsRef = collection(db, 'students');
    const snapshot = await getDocs(studentsRef);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        grade: data.grade,
        country: data.country,
        status: data.status,
        lastActiveAt: convertTimestamp(data.lastActiveAt),
        createdAt: convertTimestamp(data.createdAt),
        flags: data.flags || [],
      };
    });
  }

  async listStudentsWithMetrics(): Promise<Array<DirectoryStudent & { communicationsCount?: number; lastCommunicationAt?: Date; createdAt: Date; flags?: string[] }>> {
    const studentsRef = collection(db, 'students');
    const snapshot = await getDocs(studentsRef);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        country: data.country,
        status: data.status,
        lastActiveAt: convertTimestamp(data.lastActiveAt),
        createdAt: convertTimestamp(data.createdAt),
        communicationsCount: typeof data.communicationsCount === 'number' ? data.communicationsCount : undefined,
        lastCommunicationAt: data.lastCommunicationAt ? convertTimestamp(data.lastCommunicationAt) : undefined,
        flags: data.flags || [],
      };
    });
  }

  async getStudent(id: string): Promise<Student | null> {
    const studentRef = doc(db, 'students', id);
    const snapshot = await getDoc(studentRef);
    if (!snapshot.exists()) return null;
    
    const data = snapshot.data();
    return {
      id: snapshot.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      grade: data.grade,
      country: data.country,
      status: data.status,
      lastActiveAt: convertTimestamp(data.lastActiveAt),
      createdAt: convertTimestamp(data.createdAt),
      flags: data.flags || [],
    };
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<void> {
    const studentRef = doc(db, 'students', id);
    const updateData: Record<string, unknown> = { ...updates };
    
    if (updates.lastActiveAt) {
      updateData.lastActiveAt = toTimestamp(updates.lastActiveAt);
    }
    if (updates.createdAt) {
      updateData.createdAt = toTimestamp(updates.createdAt);
    }
    
    await updateDoc(studentRef, updateData);
  }

  // Interactions
  async addInteraction(interaction: Interaction): Promise<void> {
    const interactionsRef = collection(db, 'interactions');
    const interactionData = {
      ...interaction,
      createdAt: toTimestamp(interaction.createdAt),
    };
    await addDoc(interactionsRef, interactionData);
  }

  async listInteractions(studentId: string): Promise<Interaction[]> {
    const interactionsRef = collection(db, 'interactions');
    const q = query(
      interactionsRef, 
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        studentId: data.studentId,
        type: data.type,
        metadata: data.metadata,
        createdAt: convertTimestamp(data.createdAt),
      };
    });
  }

  // Communications
  async addCommunication(communication: Communication): Promise<void> {
    const communicationsRef = collection(db, 'communications');
    const communicationData = {
      ...communication,
      createdAt: toTimestamp(communication.createdAt),
    };
    await addDoc(communicationsRef, communicationData);
    // Update per-student counters and last communication metadata
    const studentRef = doc(db, 'students', communication.studentId);
    await updateDoc(studentRef, {
      communicationsCount: increment(1),
      lastCommunicationAt: toTimestamp(communication.createdAt),
      lastCommunicationChannel: communication.channel,
    });
  }

  async listCommunications(studentId: string): Promise<Communication[]> {
    const communicationsRef = collection(db, 'communications');
    const q = query(
      communicationsRef, 
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        studentId: data.studentId,
        channel: data.channel,
        subject: data.subject,
        body: data.body,
        createdAt: convertTimestamp(data.createdAt),
        createdBy: data.createdBy,
      };
    });
  }

  async updateCommunication(studentId: string, id: string, updates: Partial<Pick<Communication, 'subject' | 'body' | 'channel' | 'createdAt'>>): Promise<void> {
    const communicationRef = doc(db, 'communications', id);
    const updateData: Record<string, unknown> = { ...updates };
    if (updates.createdAt) updateData.createdAt = toTimestamp(updates.createdAt);
    await updateDoc(communicationRef, updateData);
  }

  async deleteCommunication(studentId: string, id: string): Promise<void> {
    const communicationRef = doc(db, 'communications', id);
    await deleteDoc(communicationRef);
    // Decrement counter and recompute lastCommunicationAt
    const studentRef = doc(db, 'students', studentId);
    try {
      await updateDoc(studentRef, { communicationsCount: increment(-1) });
    } catch {
      // ignore if field missing
    }
    // Recompute latest communication timestamp/channel
    const communicationsRef = collection(db, 'communications');
    const q = query(
      communicationsRef,
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.docs.length > 0) {
      const data = snapshot.docs[0].data() as {
        createdAt: Timestamp | { toDate: () => Date } | Date;
        channel: string;
      };
      await updateDoc(studentRef, {
        lastCommunicationAt: data.createdAt,
        lastCommunicationChannel: data.channel,
      });
    } else {
      await updateDoc(studentRef, {
        lastCommunicationAt: null as unknown as Timestamp,
        lastCommunicationChannel: null as unknown as string,
      });
    }
  }

  // Notes
  async addNote(note: Note): Promise<void> {
    const notesRef = collection(db, 'notes');
    const noteData = {
      ...note,
      createdAt: toTimestamp(note.createdAt),
    };
    await addDoc(notesRef, noteData);
  }

  async listNotes(studentId: string): Promise<Note[]> {
    const notesRef = collection(db, 'notes');
    const q = query(
      notesRef, 
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        studentId: data.studentId,
        content: data.content,
        createdAt: convertTimestamp(data.createdAt),
        createdBy: data.createdBy,
      };
    });
  }

  async updateNote(studentId: string, id: string, content: string): Promise<void> {
    const noteRef = doc(db, 'notes', id);
    await updateDoc(noteRef, { content });
  }

  async deleteNote(studentId: string, id: string): Promise<void> {
    const noteRef = doc(db, 'notes', id);
    await deleteDoc(noteRef);
  }

  // Tasks
  async addTask(task: Task): Promise<void> {
    const tasksRef = collection(db, 'tasks');
    const taskData = {
      ...task,
      createdAt: toTimestamp(task.createdAt),
      dueAt: task.dueAt ? toTimestamp(task.dueAt) : null,
    };
    await addDoc(tasksRef, taskData);
  }

  async listTasks(studentId: string): Promise<Task[]> {
    const tasksRef = collection(db, 'tasks');
    const q = query(
      tasksRef, 
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        studentId: data.studentId,
        title: data.title,
        dueAt: data.dueAt ? convertTimestamp(data.dueAt) : undefined,
        status: data.status,
        assignee: data.assignee,
        createdAt: convertTimestamp(data.createdAt),
      };
    });
  }

  async deleteTask(studentId: string, id: string): Promise<void> {
    const taskRef = doc(db, 'tasks', id);
    await deleteDoc(taskRef);
  }

  async updateTask(studentId: string, id: string, updates: Partial<Pick<Task, 'title' | 'status' | 'dueAt'>>): Promise<void> {
    const taskRef = doc(db, 'tasks', id);
    const updateData: Record<string, unknown> = { ...updates };
    if (updates.dueAt) updateData.dueAt = toTimestamp(updates.dueAt);
    await updateDoc(taskRef, updateData);
  }
}

// Export singleton instance
export const firebaseDb = new FirebaseDb();
