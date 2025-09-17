"use client";

import { useState } from "react";
import { firebaseDb } from "@/lib/firebaseDb";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Student, Communication, Interaction, Task, Note } from "@/domain/types";

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

const sampleStudents: Array<Omit<Student, "lastActiveAt" | "createdAt"> & {
  id: string;
  lastActiveAt: Date;
  createdAt: Date;
  flags?: string[];
}> = [
  { id: "stu_101", name: "Liam Martinez", email: "liam.martinez@example.com", country: "USA", status: "Shortlisting", lastActiveAt: daysAgo(1), createdAt: daysAgo(30), flags: ["high_intent"] },
  { id: "stu_102", name: "Priya Kapoor", email: "priya.kapoor@example.in", country: "India", status: "Exploring", lastActiveAt: daysAgo(3), createdAt: daysAgo(45), flags: ["needs_essay_help"] },
  { id: "stu_103", name: "Daniel Nguyen", email: "daniel.nguyen@example.vn", country: "Vietnam", status: "Applying", lastActiveAt: daysAgo(2), createdAt: daysAgo(38), flags: ["high_intent"] },
  { id: "stu_104", name: "Amara Okoye", email: "amara.okoye@example.ng", country: "Nigeria", status: "Exploring", lastActiveAt: daysAgo(6), createdAt: daysAgo(50) },
  { id: "stu_105", name: "Sofia Rossi", email: "sofia.rossi@example.it", country: "Italy", status: "Submitted", lastActiveAt: daysAgo(4), createdAt: daysAgo(60) },
  { id: "stu_106", name: "Kenji Tanaka", email: "kenji.tanaka@example.jp", country: "Japan", status: "Applying", lastActiveAt: daysAgo(0), createdAt: daysAgo(28), flags: ["high_intent"] },
  { id: "stu_107", name: "Maria Lopez", email: "maria.lopez@example.mx", country: "Mexico", status: "Shortlisting", lastActiveAt: daysAgo(8), createdAt: daysAgo(55), flags: ["needs_essay_help"] },
  { id: "stu_108", name: "Ahmed Hassan", email: "ahmed.hassan@example.eg", country: "Egypt", status: "Exploring", lastActiveAt: daysAgo(5), createdAt: daysAgo(40) },
  { id: "stu_109", name: "Chloe Dubois", email: "chloe.dubois@example.fr", country: "France", status: "Applying", lastActiveAt: daysAgo(7), createdAt: daysAgo(35), flags: ["needs_essay_help"] },
  { id: "stu_110", name: "Lucas Müller", email: "lucas.mueller@example.de", country: "Germany", status: "Shortlisting", lastActiveAt: daysAgo(1), createdAt: daysAgo(25), flags: ["high_intent"] },
];

export default function SeedPage() {
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function seed() {
    setBusy(true);
    setStatus("Seeding students...");
    try {
      for (const s of sampleStudents) {
        const student: Student = {
          id: s.id,
          name: s.name,
          email: s.email,
          country: s.country,
          status: s.status,
          lastActiveAt: s.lastActiveAt,
          createdAt: s.createdAt,
          phone: undefined,
          grade: undefined,
          flags: s.flags || [],
        };
        await firebaseDb.upsertStudent(student);

        // Add a couple of interactions
        const interactions: Interaction[] = [
          { id: `int_${s.id}_1`, studentId: s.id, type: "login", createdAt: daysAgo(2) },
          { id: `int_${s.id}_2`, studentId: s.id, type: "document_upload", metadata: { name: "Transcript.pdf" }, createdAt: daysAgo(3) },
        ];
        for (const it of interactions) await firebaseDb.addInteraction(it);

        // One recent communication
        const comm: Communication = {
          id: `comm_${s.id}_1`,
          studentId: s.id,
          channel: "email",
          subject: "Welcome to Undergraduation",
          body: `Hi ${s.name.split(" ")[0]}, welcome!`,
          createdAt: daysAgo(1),
          createdBy: "system",
        };
        await firebaseDb.addCommunication(comm);

        // One task
        const task: Task = {
          id: `task_${s.id}_1`,
          studentId: s.id,
          title: "Schedule intro call",
          dueAt: daysAgo(-3),
          status: "pending",
          assignee: "admin@demo",
          createdAt: daysAgo(2),
        };
        await firebaseDb.addTask(task);

        // One note
        const note: Note = {
          id: `note_${s.id}_1`,
          studentId: s.id,
          content: "Seeded by admin",
          createdAt: daysAgo(2),
          createdBy: "admin@demo",
        };
        await firebaseDb.addNote(note);
      }
      setStatus("Done. Check students list.");
    } catch (e) {
      setStatus(`Failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <Card className="p-6">
        <h1 className="text-xl font-semibold mb-2">Seed Firestore</h1>
        <p className="text-slate-600 mb-4">Adds 10 students with example interactions, communications, notes, and tasks. You must be signed in.</p>
        <Button onClick={seed} disabled={busy}>
          {busy ? "Seeding..." : "Seed sample data"}
        </Button>
        {status && <div className="mt-4 text-sm text-slate-700">{status}</div>}
      </Card>
    </div>
  );
}


