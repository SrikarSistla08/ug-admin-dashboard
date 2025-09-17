"use client";
import { firebaseDb } from "@/lib/firebaseDb";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Communication, Note, Task, Interaction, Student, applicationStatuses, ApplicationStatus } from "@/domain/types";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Progress } from "@/components/ui/Progress";
import { Input, Textarea } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Timeline from "./Timeline";
import AISummary from "./AISummary";

export default function StudentProfile({ params }: { params: Promise<{ id: string }> }) {
  const [tab, setTab] = useState<string>("timeline");
  const [studentId, setStudentId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { push } = useToast();
  
  // Initialize all state hooks with default values first
  const [status, setStatus] = useState<ApplicationStatus>("Exploring");
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comms, setComms] = useState<Communication[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskDraft, setTaskDraft] = useState<{ title: string; status: Task['status']; due: string }>({ title: "", status: "pending", due: "" });
  
  // Resolve params
  useEffect(() => {
    params.then((resolvedParams) => {
      setStudentId(resolvedParams.id);
    });
  }, [params]);
  
  // Student and related data
  const [student, setStudent] = useState<Student | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  
  // Load data once we have studentId
  useEffect(() => {
    if (!studentId) return;
    let isCancelled = false;
    (async () => {
      setIsLoading(true);
      const s = await firebaseDb.getStudent(studentId);
      if (isCancelled) return;
      setStudent(s);
      if (s) {
        setStatus(s.status);
        const [notesList, tasksList, commsList, interList] = await Promise.all([
          firebaseDb.listNotes(s.id),
          firebaseDb.listTasks(s.id),
          firebaseDb.listCommunications(s.id),
          firebaseDb.listInteractions(s.id),
        ]);
        if (isCancelled) return;
        setNotes(notesList);
        setTasks(tasksList);
        setComms(commsList);
        setInteractions(interList);
      }
      setIsLoading(false);
    })();
    return () => {
      isCancelled = true;
    };
  }, [studentId]);
  
  // Show loading state while resolving params
  if (isLoading) {
    return (
      <div className="px-6 py-8 max-w-5xl mx-auto">
        <div className="text-center py-8">
          <div className="text-slate-600">Loading student profile...</div>
        </div>
      </div>
    );
  }
  
  // Handle not found case - this must happen after all hooks
  if (!student) { 
    notFound(); 
  }
  
  const current = student; // narrow for TS below

  function generateId(prefix: string) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  // Notes
  function handleAddNote(formData: FormData) {
    const content = String(formData.get("content") || "").trim();
    if (!content) return;
    const record: Note = {
      id: generateId("note"),
      studentId: current.id,
      content,
      createdAt: new Date(),
      createdBy: "admin@demo",
    };
    (async () => {
      await firebaseDb.addNote(record);
      const list = await firebaseDb.listNotes(current.id);
      setNotes(list);
    })();
  }

  function handleDeleteNote(id: string) {
    (async () => {
      await firebaseDb.deleteNote(current.id, id);
      const list = await firebaseDb.listNotes(current.id);
      setNotes(list);
    })();
  }

  // Tasks
  function handleAddTask(formData: FormData) {
    const title = String(formData.get("title") || "").trim();
    const due = String(formData.get("dueAt") || "").trim();
    if (!title) return;
    const record: Task = {
      id: generateId("task"),
      studentId: current.id,
      title,
      dueAt: due ? new Date(due) : undefined,
      status: "pending",
      assignee: "admin@demo",
      createdAt: new Date(),
    };
    (async () => {
      await firebaseDb.addTask(record);
      const list = await firebaseDb.listTasks(current.id);
      setTasks(list);
    })();
  }

  function handleDeleteTask(id: string) {
    (async () => {
      await firebaseDb.deleteTask(current.id, id);
      const list = await firebaseDb.listTasks(current.id);
      setTasks(list);
    })();
  }

  // Communications
  function handleAddComm(formData: FormData) {
    const channel = String(formData.get("channel") || "email") as Communication["channel"];
    const subject = String(formData.get("subject") || "").trim();
    const body = String(formData.get("body") || "").trim();
    if (!body) return;
    const record: Communication = {
      id: generateId("comm"),
      studentId: current.id,
      channel,
      subject: subject || undefined,
      body,
      createdAt: new Date(),
      createdBy: "admin@demo",
    };
    (async () => {
      await firebaseDb.addCommunication(record);
      const list = await firebaseDb.listCommunications(current.id);
      setComms(list);
    })();
  }

  function handleDeleteComm(id: string) {
    (async () => {
      await firebaseDb.deleteCommunication(current.id, id);
      const list = await firebaseDb.listCommunications(current.id);
      setComms(list);
    })();
  }

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <Link href="/students" className="text-sm text-blue-600 hover:underline">
        ← Back to Students
      </Link>
      <div className="mt-4 flex items-center gap-4">
        <Avatar name={current.name} />
        <div>
          <h1 className="text-2xl font-semibold">{current.name}</h1>
          <p className="text-sm text-slate-600">{current.email} • {current.country}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-medium mb-3 flex items-center gap-2">
            <span>📋</span> Summary
          </h2>
          <div className="text-sm text-slate-700 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Phone:</span>
              <span>{current.phone ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Grade:</span>
              <span>{current.grade ?? "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Status:</span>
              <Badge variant={status.toLowerCase() as "exploring" | "shortlisting" | "applying" | "submitted"}>{status}</Badge>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-medium mb-3 flex items-center gap-2">
            <span>📊</span> Progress
          </h2>
          <div className="mb-4">
            <Progress value={(applicationStatuses.indexOf(status) + 1) / applicationStatuses.length * 100} />
            <div className="text-xs text-slate-600 mt-1">
              {applicationStatuses.indexOf(status) + 1} of {applicationStatuses.length} stages
            </div>
          </div>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              (async () => {
                await firebaseDb.updateStudent(current.id, { status });
                const s = await firebaseDb.getStudent(current.id);
                setStudent(s);
                push("Stage updated");
              })();
            }}
          >
            <label className="text-xs text-slate-600 font-medium">Stage</label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
              aria-label="Select application stage"
            >
              {applicationStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
            <Button type="submit" size="sm">Update</Button>
          </form>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-slate-700 mb-2">Activity</h2>
        <Tabs tabs={["timeline", "comms", "notes", "tasks", "ai-summary"]} active={tab} onChange={setTab} />

        {tab === "timeline" && (
          <Card className="mt-4 p-5">
            <h2 className="font-medium mb-4 flex items-center gap-2">
              <span>📈</span> Interaction Timeline
            </h2>
            <Timeline interactions={interactions} />
          </Card>
        )}
        {tab === "comms" && (
          <Card className="mt-4 p-5">
            <h2 className="font-medium mb-4 flex items-center gap-2">
              <span>💬</span> Communication Log
            </h2>
            <div className="mb-4">
              <Button size="sm"
                onClick={async () => {
                  const res = await fetch("/api/followup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      studentId: current.id,
                      subject: "Follow-up: Next Steps",
                      body: `Hi ${current.name.split(" ")[0]},\n\nJust checking in about your application progress. Reply if you'd like help with essays or shortlisting colleges.`,
                      to: current.email,
                    }),
                  });
                  if (res.ok) {
                    const newRecord: Communication = {
                      id: `comm_${Date.now().toString(36)}`,
                      studentId: current.id,
                      channel: "email",
                      subject: "Follow-up: Next Steps",
                      body: `Hi ${current.name.split(" ")[0]},\n\nJust checking in about your application progress. Reply if you'd like help with essays or shortlisting colleges.`,
                      createdAt: new Date(),
                      createdBy: "customer.io",
                    };
                    await firebaseDb.addCommunication(newRecord);
                    setComms((prev) => [...prev, newRecord]);
                    push("Follow-up queued");
                  } else if (typeof window !== "undefined") {
                    push("Failed to queue follow-up");
                  }
                }}
              >
                Send follow-up
              </Button>
            </div>
            <form
              className="flex flex-col gap-3 mb-6"
              action={(fd) => {
                handleAddComm(fd);
                (document.getElementById("comm-form") as HTMLFormElement | null)?.reset();
              }}
              id="comm-form"
            >
              <div className="flex gap-3 flex-wrap">
                <label className="text-sm text-slate-600 font-medium">
                  Channel
                  <Select name="channel" className="ml-2">
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="call">Call</option>
                  </Select>
                </label>
                <label className="text-sm text-slate-600 font-medium">
                  Subject
                  <Input name="subject" placeholder="Subject (optional)" className="ml-2 w-56" />
                </label>
              </div>
              <label className="text-sm text-slate-600 font-medium">
                Body
                <Textarea name="body" placeholder="Write a message..." className="mt-1 w-full" rows={3} />
              </label>
              <div>
                <Button type="submit" size="sm">Log communication</Button>
              </div>
            </form>
            <ul className="space-y-3">
              {comms.map((c) => (
                <li key={c.id} className="border border-slate-200 rounded-lg p-4 text-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default">{c.channel.toUpperCase()}</Badge>
                        <span className="text-slate-600">{format(c.createdAt, "yyyy-MM-dd HH:mm")}</span>
                      </div>
                      {c.subject && <div className="font-medium mb-2">{c.subject}</div>}
                      <div className="whitespace-pre-wrap text-slate-700">{c.body}</div>
                    </div>
                    <div className="flex items-center ml-3">
                      <Button onClick={() => handleDeleteComm(c.id)} size="sm" variant="ghost" className="text-red-600">Delete</Button>
                    </div>
                  </div>
                </li>
              ))}
              {comms.length === 0 && <li className="text-sm text-slate-500 text-center py-8">No communications yet.</li>}
            </ul>
          </Card>
        )}
        {tab === "notes" && (
          <Card className="mt-4 p-5">
            <h2 className="font-medium mb-4 flex items-center gap-2">
              <span>📝</span> Internal Notes
            </h2>
            <form
              className="flex flex-col gap-3 mb-6"
              action={(fd) => {
                handleAddNote(fd);
                (document.getElementById("note-form") as HTMLFormElement | null)?.reset();
              }}
              id="note-form"
            >
              <label className="text-sm text-slate-600 font-medium">
                Note
                <Textarea name="content" placeholder="Add a note..." className="mt-1 w-full" rows={3} />
              </label>
              <div>
                <Button type="submit" size="sm">Add note</Button>
              </div>
            </form>
            <ul className="space-y-3">
              {notes.map((n) => (
                <li key={n.id} className="border border-slate-200 rounded-lg p-4 text-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-slate-600">{format(n.createdAt, "yyyy-MM-dd HH:mm")}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-600">{n.createdBy}</span>
                      </div>
                      {editingNoteId === n.id ? (
                        <form
                          className="flex items-start gap-2"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const content = editingContent.trim();
                            if (!content || content === n.content) {
                              setEditingNoteId(null);
                              return;
                            }
                            await firebaseDb.updateNote(current.id, n.id, content);
                            const list = await firebaseDb.listNotes(current.id);
                            setNotes(list);
                            setEditingNoteId(null);
                          }}
                        >
                          <Input
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="flex-1"
                          />
                          <Button type="submit" size="sm">Save</Button>
                          <Button type="button" size="sm" variant="ghost" onClick={() => setEditingNoteId(null)}>Cancel</Button>
                        </form>
                      ) : (
                        <div className="whitespace-pre-wrap text-slate-700">{n.content}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      {editingNoteId !== n.id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label="Edit note"
                          onClick={() => {
                            setEditingNoteId(n.id);
                            setEditingContent(n.content);
                          }}
                        >
                          ✏️
                        </Button>
                      )}
                      <Button onClick={() => handleDeleteNote(n.id)} size="sm" variant="ghost" className="text-red-600">Delete</Button>
                    </div>
                  </div>
                </li>
              ))}
              {notes.length === 0 && <li className="text-sm text-slate-500 text-center py-8">No notes yet.</li>}
            </ul>
          </Card>
        )}
        {tab === "tasks" && (
          <Card className="mt-4 p-5">
            <h2 className="font-medium mb-4 flex items-center gap-2">
              <span>✅</span> Tasks / Reminders
            </h2>
            <form
              className="flex flex-col gap-3 mb-6"
              action={(fd) => {
                handleAddTask(fd);
                (document.getElementById("task-form") as HTMLFormElement | null)?.reset();
              }}
              id="task-form"
            >
              <div className="flex gap-3 flex-wrap items-center">
                <label className="text-sm text-slate-600 font-medium">
                  Title
                  <Input name="title" placeholder="Task title" className="ml-2 w-64" />
                </label>
                <label className="text-sm text-slate-600 font-medium">
                  Due
                  <Input name="dueAt" type="date" className="ml-2" />
                </label>
              </div>
              <div>
                <Button type="submit" size="sm">Add task</Button>
              </div>
            </form>
            <ul className="space-y-3">
              {tasks.map((t) => (
                <li key={t.id} className="border border-slate-200 rounded-lg p-4 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      {editingTaskId === t.id ? (
                        <form
                          className="flex flex-col gap-2 w-full"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const updates: Partial<{ title: string; status: Task['status']; dueAt?: Date }> = {};
                            if (taskDraft.title !== t.title) updates.title = taskDraft.title;
                            if (taskDraft.status !== t.status) updates.status = taskDraft.status;
                            const currentDue = t.dueAt ? format(t.dueAt, 'yyyy-MM-dd') : '';
                            if (taskDraft.due !== currentDue) updates.dueAt = taskDraft.due ? new Date(taskDraft.due) : undefined;
                            if (Object.keys(updates).length) {
                              await firebaseDb.updateTask(current.id, t.id, updates);
                              const list = await firebaseDb.listTasks(current.id);
                              setTasks(list);
                            }
                            setEditingTaskId(null);
                          }}
                        >
                          <div className="flex items-center gap-3 flex-wrap">
                            <label className="text-sm text-slate-600 font-medium">
                              Title
                              <Input
                                className="ml-2 w-64"
                                value={taskDraft.title}
                                onChange={(e) => setTaskDraft((d) => ({ ...d, title: e.target.value }))}
                              />
                            </label>
                            <label className="text-sm text-slate-600 font-medium">
                              Status
                              <Select
                                className="ml-2"
                                value={taskDraft.status}
                                onChange={(e) => setTaskDraft((d) => ({ ...d, status: e.target.value as Task['status'] }))}
                              >
                                <option value="pending">pending</option>
                                <option value="done">done</option>
                              </Select>
                            </label>
                            <label className="text-sm text-slate-600 font-medium">
                              Due
                              <Input
                                type="date"
                                className="ml-2"
                                value={taskDraft.due}
                                onChange={(e) => setTaskDraft((d) => ({ ...d, due: e.target.value }))}
                              />
                            </label>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Button type="submit" size="sm">Save</Button>
                            <Button type="button" size="sm" variant="ghost" onClick={() => setEditingTaskId(null)}>Cancel</Button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="font-medium mb-1">{t.title}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="default">{t.status}</Badge>
                            {t.dueAt && (
                              <>
                                <span className="text-slate-500">•</span>
                                <span className="text-slate-600">due {format(t.dueAt, "yyyy-MM-dd")}</span>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      {editingTaskId !== t.id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingTaskId(t.id);
                            setTaskDraft({
                              title: t.title,
                              status: t.status,
                              due: t.dueAt ? format(t.dueAt, 'yyyy-MM-dd') : '',
                            });
                          }}
                        >
                          ✏️
                        </Button>
                      )}
                      <Button onClick={() => handleDeleteTask(t.id)} size="sm" variant="ghost" className="text-red-600">Delete</Button>
                    </div>
                  </div>
                </li>
              ))}
              {tasks.length === 0 && <li className="text-sm text-slate-500 text-center py-8">No tasks yet.</li>}
            </ul>
          </Card>
        )}

        {tab === "ai-summary" && (
          <div className="mt-4">
            <AISummary 
              student={current} 
              interactions={interactions}
              communications={comms}
              notes={notes}
              tasks={tasks}
            />
          </div>
        )}
      </div>
    </div>
  );
}


