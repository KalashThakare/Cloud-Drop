import React, { useState } from "react";
import { IconMenu2, IconChevronRight, IconChevronLeft, IconUsers, IconUserPlus, IconFolder, IconMessage } from "@tabler/icons-react";
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
  const [collapsed, setCollapsed] = useState(false);

  // Responsive: auto-collapse below sm
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCollapsed(true);
      else setCollapsed(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside
      className={`
        flex flex-col items-center text-center h-full
        bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950
        border-r border-zinc-800 shadow-lg transition-all duration-400 ease-in-out z-20
        ${collapsed
          ? "w-14 min-w-[3.5rem] max-w-[3.5rem] p-2"
          : "w-2/5 xs:w-2/5 sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/5 min-w-[120px] max-w-xs p-3 xs:p-4 sm:p-5 md:p-6"
        }
        rounded-tr-md rounded-br-md backdrop-blur-md
        relative
      `}
      style={{
        boxShadow: "0 4px 8px 0 rgba(0,255,255,0.08), 0 1.5px 3px 0 rgba(0,0,0,0.12)",
      }}
    >
      {/* Collapse/Expand Button */}
      <button
        className={`
          absolute top-2 right-2 z-30 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 rounded-full p-1.5 transition-all duration-200
          ${collapsed ? "left-1/2 -translate-x-1/2 right-auto" : ""}
        `}
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <IconChevronRight size={20} /> : <IconChevronLeft size={20} />}
      </button>

      {/* Sidebar Content */}
      {!collapsed ? (
        <>
          <h2 className="flex items-center gap-2 text-lg xs:text-xl sm:text-2xl font-bold text-cyan-300 mb-3 xs:mb-4 tracking-tight drop-shadow-xs">
            <IconUsers className="w-6 h-6 text-cyan-400" />
            Your Groups
          </h2>
          <div className="w-full h-[1px] mb-6 xs:mb-8 bg-zinc-800"></div>
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
              iconText={<IconFolder className="w-5 h-5" />}
              showNameIcon
            />

            <GroupList
              title="Member Of"
              groups={memberGroups}
              selectedGroup={selectedGroup}
              handleGroupClick={handleGroupClick}
              iconClass="text-green-400"
              iconText={<IconUserPlus className="w-5 h-5" />}
              showNameIcon
            />
          </div>
        </>
      ) : (
        // Collapsed Sidebar: Only icons, all clickable
        <div className="flex flex-col items-center gap-6 w-full mt-10">
          <div className="flex flex-col items-center gap-4">
            <button
              className="text-cyan-400 hover:bg-zinc-800 rounded-full p-2 transition"
              title="Your Groups"
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
            >
              <IconUsers className="w-6 h-6" />
            </button>
            <button
              className="text-blue-400 hover:bg-zinc-800 rounded-full p-2 transition"
              title="Created By You"
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
            >
              <IconFolder className="w-5 h-5" />
            </button>
            <button
              className="text-green-400 hover:bg-zinc-800 rounded-full p-2 transition"
              title="Member Of"
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
            >
              <IconUserPlus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col items-center gap-4 mt-8">
            {createdGroups.concat(memberGroups).map((group) => (
              <button
                key={group._id}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full
                  ${selectedGroup === group
                    ? "bg-cyan-700 shadow-lg"
                    : "hover:bg-zinc-800"
                  }
                  transition-all duration-150
                `}
                onClick={() => handleGroupClick(group)}
                title={group.groupName}
              >
                <IconMessage className="w-5 h-5 text-white" />
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
