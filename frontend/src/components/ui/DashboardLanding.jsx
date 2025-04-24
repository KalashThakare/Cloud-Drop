import React from 'react'

const DashboardLanding = () => {
    return (
        <div>
            <div
                id="Home"
                className="relative h-full w-full px-10 pt-14 font-sans text-white overflow-hidden"
            >
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-zinc-900 opacity-90 -z-10" />

                {/* Intro */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold tracking-tight text-cyan-400 drop-shadow">
                        Welcome to <span className="text-white">Cloud Drop</span>
                    </h1>
                    <p className="text-lg text-zinc-400 mt-4 max-w-2xl mx-auto leading-relaxed">
                        Seamlessly manage files, collaborate with your team, and securely share data — all from one intuitive cloud workspace.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 hover:shadow-cyan-500/20 transition-all">
                        <div className="text-3xl mb-4 text-cyan-400">
                            <i className="lucide lucide-database"></i>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Switch Buckets</h3>
                        <p className="text-sm text-zinc-400">
                            Use our secure platform bucket or connect your own S3 bucket for more control and visibility.
                        </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 hover:shadow-cyan-500/20 transition-all">
                        <div className="text-3xl mb-4 text-blue-400">
                            <i className="lucide lucide-link-2"></i>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Secure File Sharing</h3>
                        <p className="text-sm text-zinc-400">
                            Upload files, generate signed URLs, set expiration and access filters with full control.
                        </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 hover:shadow-cyan-500/20 transition-all">
                        <div className="text-3xl mb-4 text-green-400">
                            <i className="lucide lucide-message-square-dots"></i>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Collaborate with Teams</h3>
                        <p className="text-sm text-zinc-400">
                            Join group chats, share project files, and discuss tasks with built-in team messaging.
                        </p>
                    </div>
                </div>

                {/* Getting Started */}
                <div className="mt-20 max-w-4xl mx-auto bg-zinc-800 border border-zinc-700 p-6 rounded-xl">
                    <h4 className="text-lg text-cyan-300 font-semibold mb-3 flex items-center gap-2">
                        <i className="lucide lucide-rocket" /> Getting Started
                    </h4>
                    <ul className="list-disc pl-5 text-zinc-400 text-sm space-y-1">
                        <li>Go to <strong>File Upload</strong> to start uploading your files.</li>
                        <li>Use <strong>Signed URL</strong> to generate secure, temporary links.</li>
                        <li>Switch between <strong>Platform</strong> and <strong>Personal Buckets</strong>.</li>
                        <li>Head into <strong>Chat Rooms</strong> and collaborate with your team.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default DashboardLanding