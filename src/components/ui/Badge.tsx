export function Badge({ children, className = "", variant = "default" }: { 
  children: React.ReactNode; 
  className?: string;
  variant?: "default" | "exploring" | "shortlisting" | "applying" | "submitted";
}) {
  const variants = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    exploring: "bg-blue-100 text-blue-800 border-blue-200",
    shortlisting: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    applying: "bg-orange-100 text-orange-800 border-orange-200",
    submitted: "bg-green-100 text-green-800 border-green-200"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}


