import React from "react";
export default function EmptyState({ message = "No data found." }) {
  return (
    <div className="text-center text-zinc-400 py-8">
      <span>{message}</span>
    </div>
  );
}
