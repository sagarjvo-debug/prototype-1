import React, { useState } from 'react';
import { AgentProvider, useAgent } from './store/agentStore';
import TaskTree from './components/TaskTree';
import ArtifactViewer from './components/ArtifactViewer';
import ThinkingPanel from './components/ThinkingPanel';
import Shell from './components/Shell';

const Omnibar = () => {
    const { sendMessage, state } = useAgent();
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    return (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm z-10">
            <div className="flex items-center gap-3 w-full max-w-4xl mx-auto">
                <div className={`w-3 h-3 rounded-full ${state.status === 'IDLE' ? 'bg-green-500' : 'bg-purple-500 animate-pulse'}`} />
                <form onSubmit={handleSubmit} className="flex-1 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="What is your goal? (e.g., 'Create a snake game')"
                        className="w-full bg-gray-100 text-gray-900 rounded-lg pl-4 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

function Layout() {
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Omnibar />
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Context & Tasks */}
                <div className="w-1/4 min-w-[250px] border-r border-gray-200 bg-white flex flex-col">
                    <TaskTree />
                </div>

                {/* Middle Panel: Workspace */}
                <div className="w-1/2 min-w-[400px] flex flex-col bg-gray-50">
                    <ArtifactViewer />
                </div>

                {/* Right Panel: Brain & Chat */}
                <div className="w-1/4 min-w-[300px] border-l border-gray-200 bg-white flex flex-col">
                    <ThinkingPanel />
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <AgentProvider>
            <Layout />
        </AgentProvider>
    );
}

export default App;
