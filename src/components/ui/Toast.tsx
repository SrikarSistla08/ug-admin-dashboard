"use client";
import { createContext, useCallback, useContext, /*useEffect,*/ useState } from "react";

type ToastItem = { id: string; text: string };

const ToastCtx = createContext<{ push: (text: string) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((text: string) => {
    const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    setItems((prev) => [...prev, { id, text }]);
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 2500);
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {items.map((i) => (
          <div key={i.id} className="text-sm px-3 py-2 rounded shadow bg-slate-900 text-white">
            {i.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}


