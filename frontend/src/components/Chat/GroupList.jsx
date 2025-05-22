import React from 'react';

const GroupList = ({
    title,
    groups,
    selectedGroup,
    handleGroupClick,
    iconClass,
    iconText
}) => {
    return (
        <div className="flex-col items-center mb-6">
            <h4 className="text-sm text-zinc-400 mb-2 uppercase tracking-widest">
                {title}
            </h4>
            <div className="space-y-1">
                {groups.map((group) => (
                    <div
                        key={group._id}
                        className={`flex justify-center items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                            selectedGroup === group
                                ? "bg-zinc-800 border-l-4 border-sky-400 shadow"
                                : "hover:bg-zinc-800"
                        }`}
                        onClick={() => handleGroupClick(group)}
                    >
                        <span className={`${iconClass} text-sm mr-2`}>{iconText}</span>
                        <span className="text-white text-pretty text-sm">
                            {group.groupName}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupList;