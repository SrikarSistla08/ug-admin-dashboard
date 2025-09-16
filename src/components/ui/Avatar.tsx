export function Avatar({ name, size = 56 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
  const style: React.CSSProperties = { width: size, height: size };
  return (
    <div
      className="rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold"
      style={style}
      aria-label={`${name} avatar`}
    >
      {initials}
    </div>
  );
}


