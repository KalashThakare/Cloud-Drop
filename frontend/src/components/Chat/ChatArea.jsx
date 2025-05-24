import React from 'react';
import WelcomeScreen from './WelcomeScreen';
import GroupHeader from './GroupHeader';
import GroupInfoPanel from './GroupInfoPanel';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatArea = ({
    selectedGroup,
    messages,
    currentUserId,
    input,
    setInput,
    handleSend,
    handleDeleteClick,
    toggleGroupInfo,
    showGroupInfo,
    setShowAddMember,
    memberRoles,
    handleRoleChange,
    saveRole,
    onRemoveMember,
}) => {
    return (
        <div className="flex flex-col flex-1 bg-zinc-950 p-2 md:p-4 min-w-[250px] w-full h-full md:min-h-[93vh] rounded-xs shadow-lg border border-zinc-800 backdrop-blur-md transition-all duration-300">
            {!selectedGroup ? (
                <WelcomeScreen />
            ) : (
                <>
                    <GroupHeader
                        selectedGroup={selectedGroup}
                        toggleGroupInfo={toggleGroupInfo}
                        handleDeleteClick={handleDeleteClick}
                        setShowAddMember={setShowAddMember}
                    />

                    {showGroupInfo && (
                        <GroupInfoPanel
                            selectedGroup={selectedGroup}
                            toggleGroupInfo={toggleGroupInfo}
                            memberRoles={memberRoles}
                            handleRoleChange={handleRoleChange}
                            saveRole={saveRole}
                            onRemoveMember={onRemoveMember}
                        />
                    )}

                    <MessageList
                        messages={messages}
                        currentUserId={currentUserId}
                        selectedGroup={selectedGroup}
                    />

                    <MessageInput
                        selectedGroup={selectedGroup}
                        input={input}
                        setInput={setInput}
                        handleSend={handleSend}
                    />
                </>
            )}
        </div>
    );
};

export default ChatArea;