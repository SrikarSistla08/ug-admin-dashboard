import { NextRequest, NextResponse } from "next/server";
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

    // Use recipient from payload (client must send student's email)
    const recipient = to;
    if (!recipient) {
      return NextResponse.json({ error: "Missing recipient email" }, { status: 400 });
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

    // Do not write to Firestore from server (rules require user auth). Client will persist.
    return NextResponse.json({ ok: true, customerio: ciStatus });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}


