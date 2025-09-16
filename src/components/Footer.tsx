export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} Undergraduation. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a 
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200" 
              href="#"
            >
              Privacy Policy
            </a>
            <a 
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200" 
              href="#"
            >
              Terms of Service
            </a>
            <a 
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200" 
              href="#"
            >
              Support
            </a>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            Built for student success • Powered by innovation
          </p>
        </div>
      </div>
    </footer>
  );
}


