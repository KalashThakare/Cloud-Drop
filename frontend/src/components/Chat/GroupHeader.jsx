import React from 'react';
import { IconInfoCircle } from "@tabler/icons-react";

const GroupHeader = ({
    selectedGroup,
    toggleGroupInfo,
    handleDeleteClick,
    setShowAddMember
}) => {
    return (
        <div className="mb-2 xs:mb-3 sm:mb-4 border-b border-zinc-800 pb-2 xs:pb-3 sm:pb-4 bg-gradient-to-r from-zinc-950/80 via-slate-950/80 to-zinc-950/60 rounded-t-xl shadow-sm">
            <div className="flex flex-row justify-between xs:items-center gap-2 px-2 xs:px-4 sm:px-6">
                {/* Group Info */}
                <div className="flex items-center gap-2 xs:gap-3">
                    <div>
                        <div
                            className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold cursor-pointer hover:text-cyan-400 flex items-center gap-1 xs:gap-2 transition-colors"
                            onClick={toggleGroupInfo}
                        >
                            <span className="truncate max-w-[120px] xs:max-w-[180px] sm:max-w-[180px] md:max-w-[150px] lg:max-w-[320px] xl:max-w-[520px]">
                                {selectedGroup.groupName}
                            </span>
                            <IconInfoCircle size={20} className="text-cyan-500 ml-4" />
                        </div>
                        <div className="text-xs xs:text-sm sm:text-base text-zinc-400">
                            {selectedGroup.members?.length} members
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 xs:mt-0 w-auto">
                    <button
                        onClick={() => setShowAddMember(true)}
                        className="text-green-700 text-xs xs:text-sm sm:text-base border min-w-[80px] border-green-700 px-4 xs:px-5 py-1 rounded-full hover:bg-green-500 hover:text-white transition-all duration-150 font-medium shadow-sm"
                    >
                        Add Member
                    </button>
                    <button
                        onClick={handleDeleteClick}
                        className="text-red-700 text-xs xs:text-sm sm:text-base border min-w-[80px] border-red-700 px-4 xs:px-5 py-1 rounded-full hover:bg-red-500 hover:text-white transition-all duration-150 font-medium shadow-sm"
                    >
                        Delete Group
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupHeader;