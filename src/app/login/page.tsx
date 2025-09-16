"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();

  // Removed automatic redirect - users must manually click to login

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <Image
                src="/download.png"
                alt="Undergraduation logo"
                width={64}
                height={64}
                className="h-16 w-16 object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Sign in to your admin dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="p-8 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Admin Access</h2>
            <p className="text-sm text-slate-600">
              Demo login for the Undergraduation admin dashboard
            </p>
          </div>

          {/* Demo Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 text-lg">ℹ️</div>
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">Demo Mode</h3>
                <p className="text-xs text-blue-700">
                  This is a demonstration dashboard. Click continue to explore the admin interface with sample data.
                </p>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-900 mb-3">What you&apos;ll find:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="text-green-600">✓</span>
                Student directory and profiles
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="text-green-600">✓</span>
                Application progress tracking
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="text-green-600">✓</span>
                Communication logs and notes
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="text-green-600">✓</span>
                Analytics and insights
              </div>
            </div>
          </div>

          {/* Login Button */}
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => {
              localStorage.setItem("ug_admin_token", "demo");
              router.replace("/students");
            }}
          >
            Continue to Dashboard
          </Button>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            This is a demo environment • All data is simulated
          </p>
        </div>
      </div>
    </div>
  );
}


