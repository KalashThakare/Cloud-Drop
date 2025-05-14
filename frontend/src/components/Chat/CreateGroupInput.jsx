import React from 'react';
import { IconPlus } from "@tabler/icons-react";

const CreateGroupInput = ({
    showInput,
    setShowInput,
    groupName,
    setGroupName,
    handleCreateGroup
}) => {
    return (
        <div className="mb-4">
            {!showInput ? (
                <button
                    onClick={() => setShowInput(true)}
                    className="w-full bg-cyan-700 hover:bg-cyan-600 text-white py-2 rounded-lg transition flex justify-center items-center gap-2"
                >
                    <span>
                        <IconPlus size={25} />
                    </span>{" "}
                    New Group
                </button>
            ) : (
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="Group name"
                        className="bg-zinc-800 border border-cyan-500 text-white px-3 py-2 rounded-lg focus:outline-none"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleCreateGroup}
                            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition"
                        >
                            Create
                        </button>
                        <button
                            onClick={() => {
                                setGroupName("");
                                setShowInput(false);
                            }}
                            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg transition"
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