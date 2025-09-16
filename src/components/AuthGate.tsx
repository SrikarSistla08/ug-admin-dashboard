"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/lib/auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const open = pathname?.startsWith("/login");
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setReady(true);
      if (!open && !user) {
        router.replace("/login");
      }
    });
    return unsubscribe;
  }, [pathname, router]);

  if (!ready) return null;

  return <>{children}</>;
}


