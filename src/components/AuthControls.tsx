"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authService } from "@/lib/auth";

export default function AuthControls() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    return authService.onAuthStateChanged((user) => setIsAuthed(!!user));
  }, []);

  const handleSignOut = async () => {
    await authService.signOut();
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


