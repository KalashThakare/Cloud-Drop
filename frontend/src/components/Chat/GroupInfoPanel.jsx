import React from "react";
import { IconX, IconCheck } from "@tabler/icons-react";

const GroupInfoPanel = ({
  selectedGroup,
  toggleGroupInfo,
  memberRoles,
  handleRoleChange,
  saveRole,
  onRemoveMember,
}) => {
  return (
    <div className="relative text-center rounded-2xl h-full w-full inset-0 bg-gradient-to-br from-zinc-900 via-slate-950 to-zinc-950 border-l border-cyan-800/40 z-50 p-4 xs:p-6 sm:p-8 md:p-10 overflow-y-auto shadow-2xl transition-all duration-300">
      {/* Close Button */}
      <button
        onClick={toggleGroupInfo}
        className="text-zinc-400 hover:text-white absolute right-2 top-2 p-2 rounded-full transition-all duration-200 bg-zinc-800/70"
        aria-label="Close"
      >
        <IconX size={24} />
      </button>

      {/* Group Info Content */}
      <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-4 xs:mb-6 text-white drop-shadow">
        Group Information
      </h3>

      <hr className="border-zinc-700 mb-4 xs:mb-6" />

      <div className="mb-4 xs:mb-6">
        <div className="text-xs xs:text-sm sm:text-base text-zinc-400 space-y-1">
          <div>
            <strong>Created:</strong>{" "}
            {new Date(selectedGroup.createdAt).toLocaleDateString()}
          </div>
          <div>
            <strong>Total Members:</strong> {selectedGroup.members?.length}
          </div>
        </div>
      </div>

      <div className="text-center flex flex-col items-center">
        <h4 className="text-base xs:text-lg sm:text-xl font-medium text-zinc-300 mb-3 xs:mb-4">
          Members & Roles
        </h4>
        <div className="flex flex-col items-center justify-center space-y-3 xs:space-y-4 w-full max-w-xs xs:max-w-md sm:max-w-lg md:max-w-xl ">
          {selectedGroup.members?.map((member) => (
            <div
              key={member._id}
              className="grid grid-cols-1 lg:grid-cols-2 w-fit items-center justify-between relative gap-2 xs:gap-4 bg-zinc-800/90 p-3 xs:p-4 rounded-xl shadow transition-all duration-200"
            >
              {/* Remove User Icon */}
              <button
                onClick={() => onRemoveMember(member)}
                className="absolute -top-3 -right-3 rounded-full border-2 border-zinc-700 hover:border-red-500 transition-all duration-200 bg-zinc-900"
                title="Delete Member"
              >
                <IconX size={18} className="text-red-600 hover:text-red-500" />
              </button>
              <div className="flex items-center justify-center gap-2 xs:gap-3">
                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white font-medium text-base xs:text-lg">
                  {member.email.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="text-xs xs:text-sm sm:text-base text-white font-medium truncate max-w-[80px] xs:max-w-[120px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] xl:max-w-[320px]">
                    {member.email}
                  </div>
                  {member._id === selectedGroup.createdBy && (
                    <div className="text-xs text-cyan-400">Admin</div>
                  )}
                </div>
              </div>

              {/* Assign Role Input */}
              {member._id !== selectedGroup.createdBy && (
                <div className="flex justify-center items-center gap-1 xs:gap-2">
                  <input
                    type="text"
                    // value={memberRoles[member._id] || ""}
                    onChange={(e) =>
                      handleRoleChange(member._id, e.target.value)
                    }
                    placeholder="Assign role"
                    className="bg-zinc-700 text-white text-xs xs:text-sm px-2 py-1 rounded border border-zinc-600 focus:border-cyan-500 transition-all duration-150"
                  />
                  <button
                    onClick={() => saveRole(member._id)}
                    className="bg-zinc-700 text-white text-xs xs:text-sm px-3 py-1 rounded hover:bg-green-600 transition-all duration-150"
                    title="Save role"
                  >
                    Assign
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupInfoPanel;
