import React from 'react';
import { IconX } from "@tabler/icons-react";

const MemberDrawer = ({ isOpen, onClose, members = [], onRemove }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-zinc-900 border-l border-zinc-800 p-6 z-50 shadow-xl overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Group Members</h3>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <IconX size={24} />
        </button>
      </div>

      <ul className="space-y-3 overflow-y-auto max-h-[80vh] pr-2">
        {members && members.length > 0 ? (
          members.map((member) => (
            <li
              key={member._id}
              className="flex justify-between items-center border-b border-zinc-800 pb-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-white">
                    {member.email ? member.email.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
                <div>
                  <p className="text-white">{member.email}</p>
                  <p className="text-xs text-zinc-400">{member.role || "Member"}</p>
                </div>
              </div>
              <button
                onClick={() => onRemove(member._id)}
                className="text-xs text-red-500 hover:text-red-400"
              >
                Remove
              </button>
            </li>
          ))
        ) : (
          <li className="text-zinc-400 text-center py-4">No members to display</li>
        )}
      </ul>
    </div>
  );
};

export default MemberDrawer;