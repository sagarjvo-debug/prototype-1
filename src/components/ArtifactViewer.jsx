import React, { useState, useEffect } from 'react';
import { FileCode, Play, GitCompare, TerminalSquare, Globe, Maximize2, FileText, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAgent } from '../store/agentStore';

const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${active
      ? 'border-blue-500 text-blue-600 bg-blue-50/50'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
  >
    <Icon size={16} />
    {label}
  </button>
);

const CodeView = ({ content }) => (
  <div className="p-4 font-mono text-sm text-gray-800 overflow-auto h-full bg-white">
    <pre>{content || '// No code generated yet'}</pre>
  </div>
);

const PlanViewer = ({ plan, onApprove, onReject }) => {
  const [feedback, setFeedback] = useState('');

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 bg-yellow-50 border-b border-yellow-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-yellow-800 font-medium">
          <FileText size={18} />
          <span>Implementation Plan Review</span>
        </div>
        <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
          Action Required
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto prose prose-sm max-w-none">
        {/* Simple markdown rendering simulation */}
        <pre className="whitespace-pre-wrap font-sans text-gray-700">{plan || 'No plan generated.'}</pre>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col gap-3">
        <textarea
          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Add feedback or request changes..."
          rows={2}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onReject(feedback)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors"
          >
            <ThumbsDown size={16} />
            Request Changes
          </button>
          <button
            onClick={onApprove}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors shadow-sm"
          >
            <ThumbsUp size={16} />
            Approve Plan
          </button>
        </div>
      </div>
    </div>
  );
};

const BrowserPreview = () => (
  <div className="flex flex-col h-full bg-gray-100">
    <div className="bg-gray-200 p-2 flex items-center gap-2 border-b border-gray-300">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
      </div>
      <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-500 truncate mx-2">
        http://localhost:3000/preview
      </div>
    </div>
    <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-3">
      <Globe size={48} className="opacity-20" />
      <p className="text-sm">Visual Debugger / Browser Preview</p>
      <button className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-xs hover:bg-gray-50">
        Launch Simulator
      </button>
    </div>
  </div>
);

export default function ArtifactViewer() {
  const { state, dispatch, approvePlan, rejectPlan } = useAgent();
  const { artifacts, status, activePlan } = state;
  const [activeTab, setActiveTab] = useState('code');

  // Auto-switch to Plan tab when reviewing
  useEffect(() => {
    if (status === 'REVIEWING') {
      setActiveTab('plan');
    }
  }, [status]);

  // Get the first artifact content for demo purposes if multiple exist
  const firstArtifactKey = Object.keys(artifacts)[0];
  const content = firstArtifactKey ? artifacts[firstArtifactKey] : '';

  if (status === 'REVIEWING' || activeTab === 'plan') {
    return <PlanViewer plan={activePlan} onApprove={approvePlan} onReject={rejectPlan} />;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-2 bg-white">
        <div className="flex">
          <TabButton
            active={activeTab === 'code'}
            onClick={() => setActiveTab('code')}
            icon={FileCode}
            label="Code"
          />
          <TabButton
            active={activeTab === 'preview'}
            onClick={() => setActiveTab('preview')}
            icon={Play}
            label="Preview"
          />
          <TabButton
            active={activeTab === 'diff'}
            onClick={() => setActiveTab('diff')}
            icon={GitCompare}
            label="Diff"
          />
          <TabButton
            active={activeTab === 'terminal'}
            onClick={() => setActiveTab('terminal')}
            icon={TerminalSquare}
            label="Terminal"
          />
        </div>
        <div className="flex items-center gap-2 pr-2">
          <span className="text-xs text-gray-400">{firstArtifactKey || 'No file'}</span>
          <button className="text-gray-400 hover:text-gray-600">
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'code' && <CodeView content={content} />}
        {activeTab === 'preview' && <BrowserPreview />}
        {activeTab === 'diff' && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No changes to compare
          </div>
        )}
        {activeTab === 'terminal' && (
          <div className="bg-gray-900 text-gray-300 p-4 font-mono text-xs h-full">
            <div className="mb-2">$ npm run dev</div>
            <div className="text-green-400">Ready in 245ms</div>
            <div>&gt; Network:  http://localhost:5173/</div>
          </div>
        )}
      </div>
    </div>
  );
}
