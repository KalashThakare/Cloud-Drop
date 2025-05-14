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
    saveRole
}) => {
    return (
        <div className="flex flex-col flex-1 bg-zinc-950 p-6">
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