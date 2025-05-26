"use client";
import React from "react";
import { toast } from "sonner";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log errorInfo to an error reporting service here
    toast.error("Something went wrong in the UI. Please refresh the page.");
  }

  render() {
    if (this.state.hasError) {
      // You can render any fallback UI here
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-red-400">
          <h2 className="text-2xl font-bold mb-2">
            Oops! An unexpected error occurred.
          </h2>
          <p className="mb-4">Please refresh the page or try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;