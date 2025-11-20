import React, { useEffect, useRef, useState } from 'react';
import { Brain, MessageSquare, CheckSquare, ChevronDown, ChevronRight, User, Bot } from 'lucide-react';
import { useAgent } from '../store/agentStore';

const ThoughtItem = ({ thought }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="mb-3 animate-fade-in">
      <div
        className="flex items-center gap-2 cursor-pointer text-xs font-medium text-purple-600 mb-1 hover:text-purple-700"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <Brain size={12} />
        <span>Thinking Process</span>
      </div>

      {expanded && (
        <div className="ml-2 pl-3 border-l-2 border-purple-100 text-sm text-gray-600 bg-purple-50/30 p-2 rounded-r">
          {thought.content}
        </div>
      )}
    </div>
  );
};

const MessageItem = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
        }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${isUser
          ? 'bg-blue-600 text-white rounded-tr-none'
          : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
        }`}>
        {message.content}
      </div>
    </div>
  );
};

const AcceptanceCriteria = () => (
  <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-4">
    <div className="flex items-center gap-2 text-green-700 font-medium text-xs mb-2 uppercase tracking-wide">
      <CheckSquare size={14} />
      Acceptance Criteria
    </div>
    <ul className="space-y-1.5">
      {['User can enter a goal', 'Agent decomposes tasks', 'Artifacts are generated'].map((criteria, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
          {criteria}
        </li>
      ))}
    </ul>
  </div>
);

export default function ThinkingPanel() {
  const { state } = useAgent();
  const { messages, thoughts } = state;
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thoughts]);

  // Interleave thoughts and messages based on timestamp if possible, 
  // but for now we'll just show thoughts that happened before the last message or similar.
  // Simpler approach: Just render the list. 
  // In a real app, we'd merge and sort. For this prototype, let's assume thoughts come from the agent 
  // and are usually interleaved with assistant messages.

  // Merging logic (mock):
  const combinedStream = [
    ...messages.map(m => ({ ...m, type: 'message' })),
    ...thoughts.map(t => ({ ...t, type: 'thought' }))
  ].sort((a, b) => parseInt(a.id) - parseInt(b.id));

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-3 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <MessageSquare size={16} />
          <span>Agent Chat</span>
        </div>
        <span className="text-xs text-gray-400">v1.0.0</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <AcceptanceCriteria />

        {combinedStream.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-10">
            Start a conversation to see the agent in action.
          </div>
        ) : (
          combinedStream.map((item) => (
            item.type === 'thought' ? (
              <ThoughtItem key={item.id} thought={item} />
            ) : (
              <MessageItem key={item.id} message={item} />
            )
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
