"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthControls() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    setIsAuthed(!!localStorage.getItem("ug_admin_token"));
  }, []);

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("ug_admin_token");
    }
    setIsAuthed(false);
    router.replace("/login");
  };

  if (isAuthed) {
    return (
      <button
        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 active:scale-95"
        onClick={handleSignOut}
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


