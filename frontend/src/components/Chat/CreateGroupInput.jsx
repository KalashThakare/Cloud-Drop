import React from "react";
import { IconPlus } from "@tabler/icons-react";

const CreateGroupInput = ({
  showInput,
  setShowInput,
  groupName,
  setGroupName,
  handleCreateGroup,
}) => {
  return (
    <div className="mb-4">
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="w-full bg-cyan-700 hover:bg-cyan-600 text-white p-2 rounded-md transition flex justify-center items-center gap-2"
        >
          <span>
            <IconPlus size={25} />
          </span>{" "}
          New Group
        </button>
      ) : (
        <div className="flex flex-col w-full max-w-full xs:max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto gap-3">
          <input
            type="text"
            placeholder="Group name"
            className="bg-zinc-800 border border-cyan-500 text-white px-3 py-2 xs:px-4 xs:py-2.5 sm:px-5 sm:py-3 rounded-lg focus:outline-none w-full text-base xs:text-lg"
            style={{ minHeight: "2.5rem" }}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            <button
              onClick={handleCreateGroup}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 xs:py-2.5 sm:py-3 rounded-lg transition text-base xs:text-lg"
              style={{ minHeight: "2.5rem" }}
            >
              Create
            </button>
            <button
              onClick={() => {
                setGroupName("");
                setShowInput(false);
              }}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-2 xs:py-2.5 sm:py-3 rounded-lg transition text-base xs:text-lg"
              style={{ minHeight: "2.5rem" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateGroupInput;
