export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`border border-slate-200 bg-white rounded-md shadow-sm ${className}`}>{children}</div>;
}

export function CardBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`font-medium mb-2 ${className}`}>{children}</h2>;
}


