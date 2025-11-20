import React from 'react';
import { CheckCircle, Circle, Clock, AlertCircle, ChevronRight, ChevronDown } from 'lucide-react';

const StatusIcon = ({ status }) => {
    switch (status) {
        case 'completed': return <CheckCircle size={16} className="text-success" />;
        case 'in_progress': return <Clock size={16} className="text-accent" />;
        case 'failed': return <AlertCircle size={16} className="text-error" />;
        default: return <Circle size={16} className="text-secondary" />;
    }
};

const TaskItem = ({ task, level = 0 }) => {
    const [expanded, setExpanded] = React.useState(true);
    const hasChildren = task.subtasks && task.subtasks.length > 0;

    return (
        <div className="task-item" style={{ paddingLeft: `${level * 12}px` }}>
            <div className="task-header">
                <button
                    className="expand-btn"
                    onClick={() => setExpanded(!expanded)}
                    style={{ visibility: hasChildren ? 'visible' : 'hidden' }}
                >
                    {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                <StatusIcon status={task.status} />
                <span className={`task-title ${task.status === 'completed' ? 'completed' : ''}`}>
                    {task.title}
                </span>
            </div>

            {expanded && hasChildren && (
                <div className="task-children">
                    {task.subtasks.map(sub => (
                        <TaskItem key={sub.id} task={sub} level={level + 1} />
                    ))}
                </div>
            )}

            <style>{`
        .task-item {
          margin-bottom: 4px;
        }
        .task-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
        }
        .task-header:hover {
          background: var(--bg-tertiary);
        }
        .expand-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          padding: 0;
          display: flex;
        }
        .task-title {
          font-size: 13px;
          color: var(--text-primary);
        }
        .task-title.completed {
          color: var(--text-secondary);
          text-decoration: line-through;
        }
        .text-success { color: var(--success); }
        .text-accent { color: var(--accent-color); }
        .text-error { color: var(--error); }
        .text-secondary { color: var(--text-secondary); }
      `}</style>
        </div>
    );
};

export default function TaskTree({ tasks }) {
    if (!tasks || tasks.length === 0) {
        return <div className="empty-state">No active tasks</div>;
    }

    return (
        <div className="task-tree">
            {tasks.map(task => (
                <TaskItem key={task.id} task={task} />
            ))}
            <style>{`
        .empty-state {
          color: var(--text-secondary);
          font-size: 13px;
          text-align: center;
          padding: 20px;
        }
      `}</style>
        </div>
    );
}
