"use client";
import { Interaction } from "@/domain/types";
import { format } from "date-fns";

function iconFor(type: Interaction["type"]) {
  if (type === "login") return <span className="text-sm">🔑</span>;
  if (type === "ai_question") return <span className="text-sm">🤖</span>;
  return <span className="text-sm">📄</span>;
}

export default function Timeline({ interactions }: { interactions: Interaction[] }) {
  const items = interactions
    .slice()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  if (items.length === 0) return (
    <div className="text-xs text-slate-500">No activity yet.</div>
  );

  return (
    <ul className="relative pl-6">
      <li className="list-none absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-black via-slate-600 to-slate-300" aria-hidden />
      <li className="list-none absolute left-1.5 top-0 w-0 h-0 border-l-[3px] border-r-[3px] border-b-[6px] border-l-transparent border-r-transparent border-b-black animate-pulse" aria-hidden />
      {items.map((i) => (
        <li key={i.id} className="mb-4 group">
          <div className="flex items-start gap-3">
            <div className="relative -left-[9px] mt-0.5 transition-transform duration-200 group-hover:scale-110">
              {iconFor(i.type)}
            </div>
            <div className="flex-1 transition-all duration-200 group-hover:bg-slate-50 group-hover:px-2 group-hover:py-1 group-hover:rounded-md">
              <div className="text-sm font-medium capitalize">{i.type.replace("_", " ")}</div>
              {i.metadata && 'q' in i.metadata && typeof i.metadata.q === 'string' && (
                <div className="text-xs text-slate-600 mt-1">{i.metadata.q}</div>
              )}
              {i.metadata && 'name' in i.metadata && typeof i.metadata.name === 'string' && (
                <div className="text-xs text-slate-600 mt-1">{i.metadata.name}</div>
              )}
              <div className="text-xs text-slate-500 mt-1">{format(i.createdAt, "yyyy-MM-dd HH:mm")}</div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}


