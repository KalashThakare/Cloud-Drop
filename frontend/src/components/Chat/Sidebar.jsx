import React from "react";
import CreateGroupInput from "./CreateGroupInput";
import GroupList from "./GroupList";

const Sidebar = ({
  createdGroups,
  memberGroups,
  selectedGroup,
  handleGroupClick,
  showInput,
  setShowInput,
  groupName,
  setGroupName,
  handleCreateGroup,
}) => {
  return (
    <aside
      className="
                flex flex-col
                items-center
                text-center
                h-full
                bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950
                border-r border-zinc-800
                shadow-lg
                transition-all
                duration-300
                z-20

                w-2/5
                sm:w-1/3
                md:w-1/3
                lg:w-1/4
                xl:w-1/5
                min-w-[120px]
                max-w-xs
                p-3 xs:p-4 sm:p-5 md:p-6
                rounded-tr-md rounded-br-md
                backdrop-blur-md
            "
            style={{
        boxShadow: "0 4px 8px 0 rgba(0,255,255,0.08), 0 1.5px 3px 0 rgba(0,0,0,0.12)",
      }}
    >
      <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-cyan-300 mb-3 xs:mb-4 tracking-tight drop-shadow-xs">
        Your Groups
      </h2>
      <div className="w-full h-[1px]  mb-6 xs:mb-8 bg-zinc-800"></div>
      <CreateGroupInput
        showInput={showInput}
        setShowInput={setShowInput}
        groupName={groupName}
        setGroupName={setGroupName}
        handleCreateGroup={handleCreateGroup}
      />

      <div className="flex-1 w-full overflow-y-auto pr-1 xs:pr-2 custom-scroll mt-2 xs:mt-3">
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
    </aside>
  );
};

export default Sidebar;
