"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { firebaseDb } from "@/lib/firebaseDb";
import { Student } from "@/domain/types";
import { format, differenceInDays } from "date-fns";
import { Input } from "@/components/ui/Input";
import { StatusSelect } from "@/components/ui/StatusSelect";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function StudentsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("");
  const [quick, setQuick] = useState<string>("");
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      const list = await firebaseDb.listStudentsFull();
      if (!isCancelled) {
        setAllStudents(list);
        setLoading(false);
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, []);

  const students = useMemo<Student[]>(() => {
    const data = allStudents;
    const q = query.trim().toLowerCase();
    let filtered = data
      .filter((s) =>
        q
          ? s.name.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.country.toLowerCase().includes(q)
          : true
      )
      .filter((s) => (status ? s.status === status : true));

    if (quick === "not7") {
      filtered = filtered.filter(
        (s) => differenceInDays(new Date(), s.lastActiveAt) >= 7
      );
    } else if (quick === "highIntent") {
      filtered = filtered.filter((s) => Array.isArray(s.flags) && s.flags.includes("high_intent"));
    } else if (quick === "essayHelp") {
      filtered = filtered.filter((s) => Array.isArray(s.flags) && s.flags.includes("needs_essay_help"));
    }

    return filtered;
  }, [query, status, quick, allStudents]);

  const stats = useMemo(() => {
    const all: Student[] = allStudents;
    const total = all.length;
    const statusCounts = all.reduce(
      (acc, s) => {
        acc[s.status] = (acc[s.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    const notContacted7d = all.filter((s) => {
      return differenceInDays(new Date(), s.lastActiveAt) >= 7;
    }).length;
    const highIntent = all.filter((s) => Array.isArray(s.flags) && (s.flags as any).includes("high_intent")).length;
    const needsEssayHelp = all.filter((s) => Array.isArray(s.flags) && (s.flags as any).includes("needs_essay_help")).length;
    return { total, statusCounts, notContacted7d, highIntent, needsEssayHelp };
  }, [allStudents]);

  if (loading) {
    return (
      <div className="px-6 py-8 max-w-6xl mx-auto w-full">
        <div className="text-sm text-slate-500">Directory</div>
        <h1 className="text-2xl font-semibold">Students</h1>
        <div className="mt-8 text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto w-full">
      <div className="mb-4">
        <div className="text-sm text-slate-500">Directory</div>
        <h1 className="text-2xl font-semibold">Students</h1>
      </div>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, country"
            className="w-64"
          />
          <StatusSelect
            value={status}
            onChange={setStatus}
            className="w-40"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-blue-600 font-medium">Active Students</div>
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-orange-600 font-medium">Not Contacted ≥7d</div>
              <div className="text-2xl font-bold text-orange-900">{stats.notContacted7d}</div>
            </div>
            <div className="text-2xl">⏰</div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-green-600 font-medium">High Intent</div>
              <div className="text-2xl font-bold text-green-900">{stats.highIntent}</div>
            </div>
            <div className="text-2xl">🔥</div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-purple-600 font-medium">Needs Essay Help</div>
              <div className="text-2xl font-bold text-purple-900">{stats.needsEssayHelp}</div>
            </div>
            <div className="text-2xl">✍️</div>
          </div>
        </Card>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <Button
          onClick={() => {
            setQuery("");
            setStatus("");
            setQuick("");
          }}
          size="sm"
          variant="ghost"
          className={`!transition-transform duration-150 ease-out active:scale-95 ${
            quick === "" ? "!bg-blue-100 !text-blue-700 !border !border-blue-300" : ""
          }`}
        >
          All
        </Button>
        <Button 
          onClick={() => setQuick("not7")} 
          size="sm" 
          variant="ghost"
          className={`!transition-transform duration-150 ease-out active:scale-95 ${
            quick === "not7" ? "!bg-orange-100 !text-orange-700 !border !border-orange-300" : ""
          }`}
        >
          ⏰ Not contacted ≥7d
        </Button>
        <Button 
          onClick={() => setQuick("highIntent")} 
          size="sm" 
          variant="ghost"
          className={`!transition-transform duration-150 ease-out active:scale-95 ${
            quick === "highIntent" ? "!bg-green-100 !text-green-700 !border !border-green-300" : ""
          }`}
        >
          🔥 High intent
        </Button>
        <Button 
          onClick={() => setQuick("essayHelp")} 
          size="sm" 
          variant="ghost"
          className={`!transition-transform duration-150 ease-out active:scale-95 ${
            quick === "essayHelp" ? "!bg-purple-100 !text-purple-700 !border !border-purple-300" : ""
          }`}
        >
          ✍️ Needs essay help
        </Button>
        <Button 
          onClick={() => setQuery("")} 
          size="sm"
          className="transition-transform duration-150 ease-out active:scale-95"
        >
          Clear search
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span>👥</span> Student Directory
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Name</th>
                <th className="text-left px-6 py-3 font-medium">Email</th>
                <th className="text-left px-6 py-3 font-medium">Country</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-left px-6 py-3 font-medium">Last Active</th>
                <th className="text-left px-6 py-3 font-medium">Profile</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors duration-150">
                  <td className="px-6 py-3 font-medium">{s.name}</td>
                  <td className="px-6 py-3 text-slate-600">{s.email}</td>
                  <td className="px-6 py-3">{s.country}</td>
                  <td className="px-6 py-3">
                    <Badge variant={s.status.toLowerCase() as "exploring" | "shortlisting" | "applying" | "submitted"}>{s.status}</Badge>
                  </td>
                  <td className="px-6 py-3 text-slate-600">{format(s.lastActiveAt, "yyyy-MM-dd")}</td>
                  <td className="px-6 py-3">
                    <Link 
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-transform duration-150 ease-out active:scale-95 inline-block" 
                      href={`/students/${s.id}`}
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}


