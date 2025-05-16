import { useSocketEventStore } from '@/store/socketEvents';
import React from 'react'

function Notification() {
    const notifications = useSocketEventStore((s) => s.notifications);
  return (
    <div className="w-full max-w-md mx-auto bg-zinc-900 text-white rounded-xl shadow-lg p-6 border border-cyan-700">
          <h2 className="text-2xl font-bold mb-4 text-cyan-300 text-center">Notifications</h2>
          {notifications.length === 0 ? (
            <div className="text-center text-gray-400">
              No new notifications.<br />
              You will see updates here when someone sends a message to a group you are not currently viewing.
            </div>
          ) : (
            <ul className="space-y-3">
              {notifications.map((n, idx) => (
                <li key={idx} className="bg-zinc-800 rounded-lg p-3 flex flex-col">
                  <span className="font-semibold">{n.text}</span>
                  <span className="text-xs text-gray-400">{new Date(n.time).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
  )
}

export default Notification