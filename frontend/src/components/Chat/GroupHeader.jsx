import React from 'react';
import { IconInfoCircle } from "@tabler/icons-react";

const GroupHeader = ({
    selectedGroup,
    toggleGroupInfo,
    handleDeleteClick,
    setShowAddMember
}) => {
    return (
        <div className="mb-4 border-b border-zinc-800 pb-3">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div>
                        <div
                            className="text-xl font-semibold cursor-pointer hover:text-cyan-400 flex items-center gap-2"
                            onClick={toggleGroupInfo}
                        >
                            {selectedGroup.groupName}
                            <IconInfoCircle size={18} className="text-cyan-500" />
                        </div>
                        <div className="text-sm text-zinc-400">
                            {selectedGroup.members?.length} members • Created on{" "}
                            {new Date(selectedGroup.createdAt).toLocaleDateString()}
                            {selectedGroup.createdBy !== "You" &&
                                selectedGroup.members?.length > 0 && (
                                <> • Created by {selectedGroup.members[0].email}</>
                                )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAddMember(true)}
                        className="text-emerald-500 text-sm border border-emerald-600 px-3 py-1 rounded hover:bg-emerald-600 hover:text-white transition"
                    >
                        Add Member
                    </button>

                    <button
                        onClick={handleDeleteClick}
                        className="text-red-600 text-sm border border-red-700 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition"
                    >
                        Delete Group
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupHeader;