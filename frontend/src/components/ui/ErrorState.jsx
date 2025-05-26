import React from "react";
export default function ErrorState({ error }) {
  return (
    <div className="text-center text-red-400 py-8">
      <span>{error?.message || "Something went wrong."}</span>
    </div>
  );
}
