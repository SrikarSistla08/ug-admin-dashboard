import { z } from "zod";

export const applicationStatuses = [
  "Exploring",
  "Shortlisting",
  "Applying",
  "Submitted",
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export const interactionTypes = [
  "login",
  "ai_question",
  "document_upload",
] as const;

export type InteractionType = (typeof interactionTypes)[number];

export const communicationChannels = ["email", "sms", "call"] as const;
export type CommunicationChannel = (typeof communicationChannels)[number];

export const taskStatuses = ["pending", "done"] as const;
export type TaskStatus = (typeof taskStatuses)[number];

export const StudentSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  grade: z.string().optional(),
  country: z.string(),
  status: z.enum(applicationStatuses),
  lastActiveAt: z.date(),
  createdAt: z.date(),
  flags: z
    .object({
      notContacted7d: z.boolean().optional(),
      highIntent: z.boolean().optional(),
      needsEssayHelp: z.boolean().optional(),
    })
    .optional(),
});

export type Student = z.infer<typeof StudentSchema>;

export const InteractionSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  type: z.enum(interactionTypes),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
});

export type Interaction = z.infer<typeof InteractionSchema>;

export const CommunicationSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  channel: z.enum(communicationChannels),
  subject: z.string().optional(),
  body: z.string(),
  createdAt: z.date(),
  createdBy: z.string(),
});

export type Communication = z.infer<typeof CommunicationSchema>;

export const NoteSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  content: z.string(),
  createdAt: z.date(),
  createdBy: z.string(),
});

export type Note = z.infer<typeof NoteSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  title: z.string(),
  dueAt: z.date().optional(),
  status: z.enum(taskStatuses),
  assignee: z.string().optional(),
  createdAt: z.date(),
});

export type Task = z.infer<typeof TaskSchema>;

export type DirectoryStudent = Pick<
  Student,
  "id" | "name" | "email" | "country" | "status" | "lastActiveAt"
>;


