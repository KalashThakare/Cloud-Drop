import { X } from "lucide-react"

export default function MemberDrawer({ isOpen, onClose, members, onRemove }) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-zinc-950 border-l border-cyan-300 p-4 shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-50`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-cyan-300 text-lg font-semibold">Group Members</h2>
        <button onClick={onClose} className="text-white hover:text-red-400">
          <X className="w-5 h-5" />
        </button>
      </div>

      <ul className="space-y-3 overflow-y-auto max-h-[80vh] pr-2">
        {members.map((member) => (
          <li
            key={member._id}
            className="flex justify-between items-center border-b border-zinc-800 pb-2"
          >
            <span className="text-white text-sm">{member.email}</span>
            <button
              onClick={() => onRemove(member._id)}
              className="text-sm text-red-400 hover:text-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
