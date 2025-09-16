"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/lib/auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const open = pathname?.startsWith("/login");
    const unsubscribe = authService.onAuthStateChanged((user) => {
      if (!open && !user) {
        router.replace("/login");
      }
    });
    return unsubscribe;
  }, [pathname, router]);

  return <>{children}</>;
}


