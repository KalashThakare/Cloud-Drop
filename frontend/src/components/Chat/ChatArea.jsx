import React from "react";
import WelcomeScreen from "./WelcomeScreen";
import GroupHeader from "./GroupHeader";
import GroupInfoPanel from "./GroupInfoPanel";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

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

          {/* Feature hint for /signedUrl */}
          {/* {selectedGroup && (
            <div className="px-2 py-1 rounded bg-slate-900/70 text-cyan-100 text-xs sm:text-sm flex-col sm:flex-row items-center gap-2 shadow-sm border border-cyan-700">
              <span className="font-semibold text-cyan-500">Tip:</span>
              Type{" "}
              <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-cyan-300 font-mono">
                /signedUrl &lt;fileName&gt; [expirationInMinutes]
              </span>
               to generate a signed URL for any file you own. Example:&nbsp;
              <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-cyan-300 font-mono">
                /signedUrl myfile.jpg 30
              </span>
            </div>
          )} */}

          {selectedGroup && (
  <div
    className="
      flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-1
      px-2 py-1
      mb-1
      rounded
      bg-slate-900/80
      text-cyan-100
      text-xs sm:text-sm
      shadow-sm border border-cyan-900
      w-full
      max-w-full
      min-h-[40px]
      sm:min-h-[36px]
      transition-all
      "
    style={{ wordBreak: "break-word" }}
  >
    
    <span><span className="font-semibold text-cyan-400">Tip: </span>
      Type{" "}
      <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-cyan-200 font-mono">
        /signedUrl &lt;fileName&gt; [expirationInMinutes]
      </span>{" "}
      to generate a signed URL for any file you own.
      <span className="hidden sm:inline"> Example:&nbsp;</span>
      <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-cyan-200 font-mono">
        /signedUrl myfile.jpg 30
      </span>
    </span>
  </div>
)}

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
