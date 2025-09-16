export function Progress({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 bg-slate-100 rounded">
      <div className="h-2 bg-blue-600 rounded" style={{ width: `${clamped}%` }} />
    </div>
  );
}


