export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "timeline": return "Timeline";
      case "comms": return "Communications";
      case "notes": return "Notes";
      case "tasks": return "Tasks";
      case "ai-summary": return "AI Summary";
      default: return tab;
    }
  };

  return (
    <div className="flex border-b border-slate-200">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-6 py-3 text-sm font-medium transition-all duration-150 ease-out relative active:scale-95 ${
            active === t 
              ? "text-blue-700 border-b-2 border-b-blue-600" 
              : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          {getTabLabel(t)}
        </button>
      ))}
    </div>
  );
}


