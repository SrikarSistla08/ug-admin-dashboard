"use client";
 
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import AuthControls from "@/components/AuthControls";

export function Header() {
  const pathname = usePathname();
  
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/students" className="flex items-center gap-3 text-slate-800 hover:text-slate-900 transition-colors duration-200">
          <Image
            src="/download.png"
            alt="Undergraduation logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
            priority
          />
          <span className="hidden sm:inline text-lg font-semibold">Undergraduation Admin</span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link 
            href="/students" 
            className={`text-sm font-medium transition-all duration-200 ${
              pathname === "/students" || pathname.startsWith("/students/") 
                ? "text-blue-700 border-b-2 border-blue-700 pb-1" 
                : "text-slate-600 hover:text-slate-900 active:scale-95"
            }`}
          >
            Students
          </Link>
          <Link 
            href="/insights" 
            className={`text-sm font-medium transition-all duration-200 ${
              pathname === "/insights" 
                ? "text-blue-700 border-b-2 border-blue-700 pb-1" 
                : "text-slate-600 hover:text-slate-900 active:scale-95"
            }`}
          >
            Insights
          </Link>
          <div className="ml-4 pl-4 border-l border-slate-200">
            <AuthControls />
          </div>
        </nav>
      </div>
    </header>
  );
}


