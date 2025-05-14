import React from 'react';

const WelcomeScreen = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center text-white h-full px-6 sm:px-10 py-12">
            <div className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Welcome to SecureChat
            </div>
            <div className="text-base sm:text-lg text-zinc-400 max-w-2xl mb-12">
                Create secure team spaces, collaborate efficiently, and share
                files safely — with AI-enhanced productivity.
            </div>

            <div className="grid gap-6 sm:grid-cols-3 w-full max-w-5xl">
                {/* Team Creation */}
                <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 transition hover:border-cyan-500 hover:shadow-md">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                        Team Creation
                    </h3>
                    <p className="text-sm text-zinc-400">
                        Set up a new workspace for your team to collaborate and
                        innovate effortlessly.
                    </p>
                </div>

                {/* Secure File Sharing */}
                <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 transition hover:border-emerald-400 hover:shadow-md">
                    <h3 className="text-lg font-semibold text-emerald-300 mb-2">
                        Secure File Sharing
                    </h3>
                    <p className="text-sm text-zinc-400">
                        Share files with time-limited secure links and granular
                        access controls.
                    </p>
                </div>

                {/* AI Summaries */}
                <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 transition hover:border-purple-400 hover:shadow-md">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                        AI-Powered Summaries
                    </h3>
                    <p className="text-sm text-zinc-400">
                        Let AI extract key insights from your documents — stay
                        focused, act faster.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;