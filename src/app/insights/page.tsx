"use client";

import { applicationStatuses, Student } from "@/domain/types";
import { useEffect, useMemo, useState } from "react";
import { firebaseDb } from "@/lib/firebaseDb";

const statusColors = {
  exploring: "bg-blue-100 text-blue-800",
  shortlisting: "bg-yellow-100 text-yellow-800", 
  applying: "bg-orange-100 text-orange-800",
  submitted: "bg-green-100 text-green-800"
};

const statusIcons = {
  exploring: "🔍",
  shortlisting: "📋",
  applying: "📝", 
  submitted: "✅"
};

export default function InsightsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [communicationsByStudent, setCommunicationsByStudent] = useState<Record<string, { createdAt: Date }[]>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const all = await firebaseDb.listStudentsFull();
      if (cancelled) return;
      setStudents(all);
      const commsEntries = await Promise.all(
        all.map(async (s) => {
          const comms = await firebaseDb.listCommunications(s.id);
          return [s.id, comms] as const;
        })
      );
      if (cancelled) return;
      setCommunicationsByStudent(Object.fromEntries(commsEntries));
    })();
    return () => { cancelled = true; };
  }, []);

  const stats = useMemo(() => {
    const all: Student[] = students;
    const total = all.length;
    const byStatus = applicationStatuses.map((s) => ({
      status: s,
      count: all.filter((stu) => stu.status === s).length,
    }));
    // Additional metrics
    const notContacted7d = all.filter((s) => {
      const comms = communicationsByStudent[s.id] || [];
      const lastComm = comms.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
      if (!lastComm) return true;
      const daysSince = (Date.now() - lastComm.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince >= 7;
    }).length;
    const highIntent = all.filter((s) => Array.isArray(s.flags) && (s.flags as any).includes("high_intent")).length;
    const needsEssayHelp = all.filter((s) => Array.isArray(s.flags) && (s.flags as any).includes("needs_essay_help")).length;
    return { total, byStatus, notContacted7d, highIntent, needsEssayHelp };
  }, [students, communicationsByStudent]);

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto w-full">
      <div className="mb-6">
        <div className="text-sm text-slate-500">Overview</div>
        <h1 className="text-2xl font-semibold">Insights</h1>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-blue-600 font-medium">Active Students</div>
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-orange-600 font-medium">Not Contacted ≥7d</div>
              <div className="text-2xl font-bold text-orange-900">{stats.notContacted7d}</div>
            </div>
            <div className="text-2xl">⏰</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-green-600 font-medium">High Intent</div>
              <div className="text-2xl font-bold text-green-900">{stats.highIntent}</div>
            </div>
            <div className="text-2xl">🔥</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-purple-600 font-medium">Needs Essay Help</div>
              <div className="text-2xl font-bold text-purple-900">{stats.needsEssayHelp}</div>
            </div>
            <div className="text-2xl">✍️</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Application Stage Progress */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📊</span> Application Progress
          </h3>
          <div className="space-y-4">
            {stats.byStatus.map(({ status, count }) => {
              const percentage = stats.total ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{statusIcons[status as keyof typeof statusIcons]}</span>
                      <span className="text-sm font-medium capitalize">{status}</span>
                    </div>
                    <div className="text-sm text-slate-600">{count} ({percentage}%)</div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        status === 'Exploring' ? 'bg-blue-500' :
                        status === 'Shortlisting' ? 'bg-yellow-500' :
                        status === 'Applying' ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution Chart */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🥧</span> Status Distribution
          </h3>
          <div className="space-y-3">
            {stats.byStatus.map(({ status, count }) => {
              const percentage = stats.total ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={status} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${
                    status === 'Exploring' ? 'bg-blue-500' :
                    status === 'Shortlisting' ? 'bg-yellow-500' :       
                    status === 'Applying' ? 'bg-orange-500' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize font-medium">{status}</span>
                      <span className="text-slate-600">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${                                                                   
                          status === 'Exploring' ? 'bg-blue-500' :      
                          status === 'Shortlisting' ? 'bg-yellow-500' : 
                          status === 'Applying' ? 'bg-orange-500' : 'bg-green-500'                                                                      
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span>📋</span> Detailed Breakdown
          </h3>
        </div>
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-6 py-3">Stage</th>
              <th className="text-left px-6 py-3">Count</th>
              <th className="text-left px-6 py-3">Share</th>
              <th className="text-left px-6 py-3">Progress</th>
            </tr>
          </thead>
          <tbody>
            {stats.byStatus.map(({ status, count }) => {
              const percentage = stats.total ? Math.round((count / stats.total) * 100) : 0;
              return (
                <tr key={status} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{statusIcons[status as keyof typeof statusIcons]}</span>
                      <span className="capitalize font-medium">{status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="font-semibold">{count}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-slate-600">{percentage}%</span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="w-20 bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${                                                                     
                          status === 'Exploring' ? 'bg-blue-500' :      
                          status === 'Shortlisting' ? 'bg-yellow-500' : 
                          status === 'Applying' ? 'bg-orange-500' : 'bg-green-500'                                                                      
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


