import React from 'react';

const ConfirmDeleteModal = ({ onCancel, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-zinc-900 text-white p-6 rounded-lg shadow-xl max-w-sm w-full border border-zinc-700">
                <h2 className="text-lg font-bold mb-3">Confirm Delete</h2>
                <p className="mb-4">
                    Are you sure you want to delete this group? This action cannot
                    be undone.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;