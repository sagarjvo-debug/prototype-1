import React, { useState } from 'react';
import { CheckCircle, Circle, Clock, AlertCircle, ChevronRight, ChevronDown, Bot, Layers } from 'lucide-react';
import { useAgent } from '../store/agentStore';

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'completed': return <CheckCircle size={16} className="text-green-600" />;
    case 'running': return <Clock size={16} className="text-blue-600 animate-spin-slow" />;
    case 'failed': return <AlertCircle size={16} className="text-red-600" />;
    default: return <Circle size={16} className="text-gray-400" />;
  }
};

const TaskItem = ({ task, level = 0 }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = task.subtasks && task.subtasks.length > 0;

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 py-1.5 px-2 hover:bg-gray-100 rounded cursor-pointer ${level > 0 ? 'ml-4' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-4 h-4 flex items-center justify-center text-gray-500">
          {hasChildren && (
            expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          )}
        </div>
        <StatusIcon status={task.status} />
        <span className={`text-sm truncate ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
          {task.title}
        </span>
      </div>

      {expanded && hasChildren && (
        <div className="border-l border-gray-200 ml-4 pl-1">
          {task.subtasks.map(sub => (
            <TaskItem key={sub.id} task={sub} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const AgentManager = () => {
  const { state } = useAgent();

  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center gap-2 mb-3">
        <Bot size={18} className="text-purple-600" />
        <h3 className="font-semibold text-gray-900 text-sm">Active Agents</h3>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-800">Gemini 3 Pro</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${state.status === 'IDLE' ? 'bg-gray-100 text-gray-600' :
              state.status === 'PLANNING' ? 'bg-purple-100 text-purple-700' :
                'bg-blue-100 text-blue-700'
            }`}>
            {state.status}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          Mode: {state.config.mode}
        </div>
      </div>
    </div>
  );
};

export default function TaskTree() {
  const { state } = useAgent();
  const { tasks } = state;

  return (
    <div className="flex flex-col h-full">
      <AgentManager />

      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex items-center gap-2 px-2 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <Layers size={14} />
          Task Graph
        </div>

        {!tasks || tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No active tasks. <br /> Start by entering a goal.
          </div>
        ) : (
          tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
}
