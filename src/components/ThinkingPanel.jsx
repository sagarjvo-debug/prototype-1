import React, { useEffect, useRef } from 'react';
import { Brain, Terminal, Lightbulb, Search } from 'lucide-react';

const TraceItem = ({ item }) => {
    const getIcon = () => {
        switch (item.type) {
            case 'thought': return <Brain size={14} />;
            case 'tool_call': return <Terminal size={14} />;
            case 'reflection': return <Lightbulb size={14} />;
            default: return <Search size={14} />;
        }
    };

    return (
        <div className={`trace-item ${item.type}`}>
            <div className="trace-icon">
                {getIcon()}
            </div>
            <div className="trace-content">
                <div className="trace-header">
                    <span className="trace-type">{item.type.replace('_', ' ')}</span>
                    <span className="trace-time">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                </div>

                {item.type === 'tool_call' ? (
                    <div className="tool-details">
                        <div className="tool-name">{item.tool}</div>
                        <div className="tool-io">
                            <span className="label">Input:</span> {item.input}
                        </div>
                        {item.output && (
                            <div className="tool-io">
                                <span className="label">Output:</span> {item.output}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="trace-text">{item.content}</div>
                )}
            </div>

            <style>{`
        .trace-item {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 13px;
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .trace-icon {
          margin-top: 2px;
          color: var(--text-secondary);
        }
        
        .trace-item.thought .trace-icon { color: var(--text-accent); }
        .trace-item.tool_call .trace-icon { color: var(--warning); }
        .trace-item.reflection .trace-icon { color: var(--success); }

        .trace-content {
          flex: 1;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 10px;
        }

        .trace-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          font-size: 11px;
          color: var(--text-secondary);
          text-transform: uppercase;
          font-weight: 600;
        }

        .trace-text {
          color: var(--text-primary);
          line-height: 1.4;
        }

        .tool-details {
          font-family: monospace;
          background: var(--bg-tertiary);
          padding: 8px;
          border-radius: 4px;
        }

        .tool-name {
          color: var(--accent-color);
          font-weight: bold;
          margin-bottom: 4px;
        }

        .tool-io {
          color: var(--text-secondary);
          font-size: 12px;
          word-break: break-all;
        }

        .label {
          color: var(--text-primary);
          font-weight: 600;
        }
      `}</style>
        </div>
    );
};

export default function ThinkingPanel({ trace }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [trace]);

    if (!trace || trace.length === 0) {
        return <div className="empty-state">Waiting for agent activity...</div>;
    }

    return (
        <div className="thinking-list">
            {trace.map((item, index) => (
                <TraceItem key={index} item={item} />
            ))}
            <div ref={bottomRef} />

            <style>{`
        .empty-state {
          color: var(--text-secondary);
          text-align: center;
          padding: 20px;
          font-size: 13px;
        }
      `}</style>
        </div>
    );
}
