import { SelectHTMLAttributes, forwardRef } from "react";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = "", ...props }, ref) => (
    <select ref={ref} className={`border border-slate-200 bg-white rounded px-3 py-2 text-sm shadow-sm ${className}`} {...props} />
  )
);
Select.displayName = "Select";


