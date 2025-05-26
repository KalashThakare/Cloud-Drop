import React from "react";
export default function LoadingSpinner({ className = "" }) {
  return (
    <div className={`flex justify-center items-center py-8 ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
