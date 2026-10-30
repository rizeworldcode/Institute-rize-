import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 w-full">
          <div className="bg-white border border-neutral-200/90 rounded-[28px] p-8 max-w-lg w-full text-center shadow-lg animate-in fade-in duration-200">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center mb-4 shadow-sm">
              <AlertTriangle size={30} />
            </div>
            <h3 className="text-xl font-black text-neutral-900 tracking-tight">
              {this.props.fallbackTitle || "Something went wrong rendering this section"}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-2 max-w-sm mx-auto">
              A temporary display error occurred. You can safely reload the page or return to the main dashboard.
            </p>
            {this.state.error && (
              <div className="mt-4 p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-left text-[11px] font-mono text-neutral-600 max-h-24 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Reload Page</span>
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = "/admin/dashboard";
                }}
                className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Home size={14} />
                <span>Go to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

