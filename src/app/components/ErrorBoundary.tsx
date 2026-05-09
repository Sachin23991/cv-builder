"use client";
/**
 * components/ErrorBoundary.tsx
 * Fix #14: Catches runtime errors in any child component tree and shows
 * a graceful fallback instead of a blank white screen.
 *
 * Usage:
 *   <ErrorBoundary fallback={<p>Preview unavailable</p>}>
 *     <SomeComponent />
 *   </ErrorBoundary>
 */
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Optional custom fallback UI. Defaults to a styled error card. */
  fallback?: ReactNode;
  /** Optional label shown in the default fallback for context (e.g. "Resume Preview") */
  label?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production, wire this to Sentry.captureException(error)
    console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
  }

  handleReset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-500/20 bg-red-950/30 p-6 text-center"
        >
          <svg
            className="h-8 w-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <div>
            <p className="font-semibold text-red-300">
              {this.props.label ?? "Something went wrong"}
            </p>
            <p className="mt-1 text-xs text-red-400/80">
              {this.state.error?.message ?? "An unexpected error occurred."}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-500/10"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
