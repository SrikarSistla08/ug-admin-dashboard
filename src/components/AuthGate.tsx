"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const open = pathname?.startsWith("/login");
    const authed = !!localStorage.getItem("ug_admin_token");
    
    if (!open && !authed) {
      router.replace("/login");
    }
  }, [pathname, router]);

  return <>{children}</>;
}


