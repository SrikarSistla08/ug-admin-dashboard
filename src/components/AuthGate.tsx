"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const open = pathname?.startsWith("/login");
    const authed = !!localStorage.getItem("ug_admin_token");
    if (!open && !authed) {
      router.replace("/login");
    }
    // Removed automatic redirect from login page - users must manually click to proceed
    setReady(true);
  }, [pathname, router]);

  if (!ready) return null;
  return <>{children}</>;
}


