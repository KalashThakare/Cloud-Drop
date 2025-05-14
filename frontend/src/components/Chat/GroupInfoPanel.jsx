import React from 'react';
import { IconX, IconCheck } from "@tabler/icons-react";

const GroupInfoPanel = ({
    selectedGroup,
    toggleGroupInfo,
    memberRoles,
    handleRoleChange,
    saveRole
}) => {
    return (
        <div className="relative text-center rounded-2xl h-full w-full inset-0 bg-zinc-900 border-l border-zinc-700 z-50 p-6 overflow-y-auto">
            {/* Close Button */}
            <button
                onClick={toggleGroupInfo}
                className="text-zinc-400 hover:text-white absolute right-2 top-2 p-2 rounded-full transition-all duration-200"
                aria-label="Close"
            >
                <IconX size={24} />
            </button>

            {/* Group Info Content */}
            <h3 className="text-2xl font-bold mb-6 text-white">
                Group Information
            </h3>

            <hr />

            <div className="mb-6">
                <div className="text-sm text-zinc-400 space-y-1">
                    <div>
                        <br />
                        <strong>Created:</strong>{" "}
                        {new Date(selectedGroup.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                        <strong>Total Members:</strong>{" "}
                        {selectedGroup.members?.length}
                    </div>
                </div>
            </div>

            <div className='text-center flex flex-col items-center'>
                <h4 className="text-lg font-medium text-zinc-300 mb-4">
                    Members & Roles
                </h4>
                <div className="space-y-4 w-fit">
                    {selectedGroup.members?.map((member) => (
                        <div
                            key={member._id}
                            className="flex items-center justify-between gap-4 bg-zinc-800 p-4 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-white font-medium">
                                    {member.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="text-sm text-white">
                                        {member.email}
                                    </div>
                                    {member._id === selectedGroup.createdBy && (
                                        <div className="text-xs text-cyan-400">
                                            Admin
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Assign Role Input */}
                            {member._id !== selectedGroup.createdBy && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={memberRoles[member._id] || ""}
                                        onChange={(e) =>
                                            handleRoleChange(member._id, e.target.value)
                                        }
                                        placeholder="Assign role"
                                        className="bg-zinc-700 text-white text-xs px-2 py-1 rounded border border-zinc-600"
                                    />
                                    <button
                                        onClick={() => saveRole(member._id)}
                                        className="text-green-500 hover:text-green-400"
                                        title="Save role"
                                    >
                                        <IconCheck size={16} />
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