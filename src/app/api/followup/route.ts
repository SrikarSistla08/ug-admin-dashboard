import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/data/mockDb";
import { Communication } from "@/domain/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, subject, body: message } = body as {
      studentId: string;
      subject?: string;
      body: string;
    };
    if (!studentId || !message) {
      return NextResponse.json({ error: "Missing studentId or body" }, { status: 400 });
    }
    const record: Communication = {
      id: `comm_${Date.now().toString(36)}`,
      studentId,
      channel: "email",
      subject: subject || "Follow-up",
      body: message,
      createdAt: new Date(),
      createdBy: "customer.io-mock",
    };
    mockDb.addCommunication(record);
    return NextResponse.json({ ok: true, id: record.id });
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}


