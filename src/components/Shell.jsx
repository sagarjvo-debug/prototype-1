import React, { useState } from 'react';
import { useAgent } from '../store/agentStore';
import { Menu, MessageSquare, Brain, Layers, Play, Pause, Settings } from 'lucide-react';
import ThinkingPanel from './ThinkingPanel';
import TaskTree from './TaskTree';
import ArtifactViewer from './ArtifactViewer';

export default function Shell() {
    const { state, sendMessage, toggleAutoRun, stepForward } = useAgent();
    const [input, setInput] = useState('');
    const [showThinking, setShowThinking] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    return (
        <div className="shell-container">
            {/* Sidebar - Tasks & Status */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <Brain size={24} className="text-accent" />
                        <span className="font-bold">Antigravity</span>
                    </div>
                    <div className="status-badge" data-status={state.status}>
                        {state.status}
                    </div>
                </div>

                <div className="sidebar-content">
                    <div className="section-title">
                        <Layers size={16} />
                        <span>Tasks</span>
                    </div>
                    <TaskTree tasks={state.tasks} />
                </div>

                <div className="sidebar-footer">
                    <button className="icon-btn" onClick={toggleAutoRun}>
                        {state.config.autoRun ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button className="icon-btn" onClick={stepForward} disabled={state.config.autoRun}>
                        Step
                    </button>
                    <button className="icon-btn">
                        <Settings size={18} />
                    </button>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="main-chat">
                <div className="chat-messages">
                    {state.messages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.role}`}>
                            <div className="message-avatar">
                                {msg.role === 'user' ? 'U' : 'A'}
                            </div>
                            <div className="message-content">
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="chat-input-area">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Describe your goal..."
                            className="chat-input"
                        />
                        <button type="submit" className="send-btn">
                            <MessageSquare size={18} />
                        </button>
                    </form>
                </div>
            </main>

            {/* Right Panel - Thinking & Artifacts */}
            {showThinking && (
                <aside className="thinking-panel">
                    <div className="panel-header">
                        <h3>Reasoning Trace</h3>
                    </div>
                    <div className="panel-content">
                        <ThinkingPanel trace={state.trace} />
                    </div>
                    <div className="panel-header">
                        <h3>Artifacts</h3>
                    </div>
                    <div className="panel-content">
                        <ArtifactViewer artifacts={state.artifacts} />
                    </div>
                </aside>
            )}

            <style>{`
        .shell-container {
          display: flex;
          height: 100vh;
          background: var(--bg-primary);
          color: var(--text-primary);
        }
        
        .sidebar {
          width: 280px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
        }
        
        .sidebar-header {
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .status-badge {
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 4px;
          background: var(--bg-tertiary);
          text-transform: uppercase;
          font-weight: bold;
        }
        
        .status-badge[data-status="PLANNING"] { background: var(--warning); color: black; }
        .status-badge[data-status="EXECUTING"] { background: var(--accent-color); color: white; }
        
        .sidebar-content {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
        }
        
        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 12px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        
        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid var(--border-color);
          display: flex;
          gap: 8px;
        }
        
        .icon-btn {
          background: var(--bg-tertiary);
          border: none;
          color: var(--text-primary);
          padding: 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .icon-btn:hover {
          background: var(--accent-color);
        }
        
        .main-chat {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--bg-primary);
        }
        
        .chat-messages {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .message {
          display: flex;
          gap: 12px;
          max-width: 80%;
        }
        
        .message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        
        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        
        .message.user .message-avatar {
          background: var(--accent-color);
        }
        
        .message-content {
          background: var(--bg-secondary);
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
        }
        
        .message.user .message-content {
          background: var(--accent-color);
          color: white;
        }
        
        .chat-input-area {
          padding: 24px;
          border-top: 1px solid var(--border-color);
        }
        
        .chat-input-area form {
          display: flex;
          gap: 12px;
        }
        
        .chat-input {
          flex: 1;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 12px;
          border-radius: 8px;
          color: var(--text-primary);
          outline: none;
        }
        
        .chat-input:focus {
          border-color: var(--accent-color);
        }
        
        .send-btn {
          background: var(--accent-color);
          border: none;
          color: white;
          padding: 0 16px;
          border-radius: 8px;
        }
        
        .thinking-panel {
          width: 350px;
          background: var(--bg-secondary);
          border-left: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
        }
        
        .panel-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-tertiary);
        }
        
        .panel-header h3 {
          font-size: 14px;
          font-weight: 600;
        }
        
        .panel-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }
      `}</style>
        </div>
    );
}
