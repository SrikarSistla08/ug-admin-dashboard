import { NextRequest, NextResponse } from "next/server";
import { Communication } from "@/domain/types";
import { firebaseDb } from "@/lib/firebaseDb";
import { customerIOService } from "@/lib/customerio";

export async function POST(req: NextRequest) {
  try {
    const bodyJson = await req.json();
    const { studentId, subject, body: message, to } = bodyJson as {
      studentId: string;
      subject?: string;
      body: string;
      to?: string;
    };

    if (!studentId || !message) {
      return NextResponse.json({ error: "Missing studentId or body" }, { status: 400 });
    }

    // Resolve recipient email from payload or Firestore
    let recipient = to;
    if (!recipient) {
      const student = await firebaseDb.getStudent(studentId);
      if (!student || !student.email) {
        return NextResponse.json({ error: "No recipient email available" }, { status: 400 });
      }
      recipient = student.email;
    }

    // Try Customer.io (soft-fail in dev)
    let ciStatus: 'sent' | 'skipped' = 'sent';
    try {
      await customerIOService.upsertCustomer(studentId, { email: recipient });
      await customerIOService.sendEmail(studentId, {
        to: recipient,
        subject: subject || "Follow-up",
        body: message,
      });
    } catch {
      ciStatus = 'skipped';
    }

    // Persist communication record in Firestore
    const record: Communication = {
      id: `comm_${Date.now().toString(36)}`,
      studentId,
      channel: "email",
      subject: subject || "Follow-up",
      body: message,
      createdAt: new Date(),
      createdBy: "customer.io",
    };
    await firebaseDb.addCommunication(record);

    return NextResponse.json({ ok: true, id: record.id, customerio: ciStatus });
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}


