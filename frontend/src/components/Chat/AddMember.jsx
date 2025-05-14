import React from 'react';

const AddMemberModal = ({ memberEmail, setMemberEmail, onCancel, onAdd }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-zinc-900 text-white p-6 rounded-lg shadow-xl max-w-sm w-full border border-zinc-700">
                <h2 className="text-lg font-bold mb-3">Add Member</h2>
                <input
                    type="email"
                    placeholder="Enter member's email"
                    className="w-full p-2 mb-4 rounded bg-zinc-800 border border-zinc-600 text-white"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                />
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;