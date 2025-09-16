"use client";
import { useState, useRef, useEffect } from "react";
import { applicationStatuses, ApplicationStatus } from "@/domain/types";

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const statusColors = {
  "": "bg-slate-100 text-slate-800",
  "Exploring": "bg-blue-100 text-blue-800",
  "Shortlisting": "bg-yellow-100 text-yellow-800", 
  "Applying": "bg-orange-100 text-orange-800",
  "Submitted": "bg-green-100 text-green-800"
};

const statusIcons = {
  "": "📋",
  "Exploring": "🔍",
  "Shortlisting": "📋",
  "Applying": "📝", 
  "Submitted": "✅"
};

export function StatusSelect({ value, onChange, className = "" }: StatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { value: "", label: "All Statuses", icon: "📋" },
    ...applicationStatuses.map(status => ({
      value: status,
      label: status,
      icon: statusIcons[status as keyof typeof statusIcons]
    }))
  ];

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border border-slate-200 bg-white rounded px-3 py-2 text-sm shadow-sm flex items-center justify-between hover:bg-slate-50 transition-colors duration-150 ${
          statusColors[value as keyof typeof statusColors] || statusColors[""]
        }`}
        aria-label="Filter by status"
      >
        <div className="flex items-center gap-2">
          <span>{selectedOption.icon}</span>
          <span>{selectedOption.label}</span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-slate-50 transition-colors duration-150 ${
                value === option.value ? "bg-slate-100" : ""
              }`}
            >
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                statusColors[option.value as keyof typeof statusColors] || statusColors[""]
              }`}>
                <span className="mr-1">{option.icon}</span>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
