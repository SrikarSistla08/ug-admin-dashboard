import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input ref={ref} className={`border border-slate-200 bg-white rounded px-3 py-2 text-sm shadow-sm ${className}`} {...props} />
  )
);
Input.displayName = "Input";

export function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`border border-slate-200 bg-white rounded px-2 py-1 text-sm shadow-sm ${className}`} {...props} />;
}


