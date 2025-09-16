"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthControls() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    // Read auth token on mount and whenever the route changes
    setIsAuthed(!!localStorage.getItem("ug_admin_token"));
    setMounted(true);
  }, [pathname]);

  if (!mounted) return null;

  if (isAuthed) {
    return (
      <button
        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 active:scale-95"
        onClick={() => {
          localStorage.removeItem("ug_admin_token");
          setIsAuthed(false);
          router.replace("/login");
        }}
      >
        Sign out
      </button>
    );
  }

  return (
    <Link 
      href="/login" 
      className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 active:scale-95"
    >
      Sign in
    </Link>
  );
}


