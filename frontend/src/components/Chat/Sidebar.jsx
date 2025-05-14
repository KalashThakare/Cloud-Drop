import React from 'react';
import { IconPlus } from "@tabler/icons-react";
import CreateGroupInput from './CreateGroupInput';
import GroupList from './GroupList';

const Sidebar = ({
    createdGroups,
    memberGroups,
    selectedGroup,
    handleGroupClick,
    showInput,
    setShowInput,
    groupName,
    setGroupName,
    handleCreateGroup
}) => {
    return (
        <div className="w-72 bg-zinc-900 border-r border-zinc-800 p-4 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-4 tracking-tight">
                Your Groups
            </h2>

            <CreateGroupInput
                showInput={showInput}
                setShowInput={setShowInput}
                groupName={groupName}
                setGroupName={setGroupName}
                handleCreateGroup={handleCreateGroup}
            />

            <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
                <GroupList
                    title="Created By You"
                    groups={createdGroups}
                    selectedGroup={selectedGroup}
                    handleGroupClick={handleGroupClick}
                    iconClass="text-blue-400"
                    iconText="📁"
                />

                <GroupList
                    title="Member Of"
                    groups={memberGroups}
                    selectedGroup={selectedGroup}
                    handleGroupClick={handleGroupClick}
                    iconClass="text-green-400"
                    iconText="👥"
                />
            </div>
        </div>
    );
};

export default Sidebar;