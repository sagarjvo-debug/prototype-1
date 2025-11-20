import React, { useState } from 'react';
import { FileCode, Play, GitDiff, TerminalSquare, Globe, Maximize2 } from 'lucide-react';
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
  const { state } = useAgent();
  const { artifacts } = state;
  const [activeTab, setActiveTab] = useState('code');

  // Get the first artifact content for demo purposes if multiple exist
  const firstArtifactKey = Object.keys(artifacts)[0];
  const content = firstArtifactKey ? artifacts[firstArtifactKey] : '';

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
            icon={GitDiff}
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
            import React, {useState} from 'react';
            import {FileCode, Play, GitDiff, TerminalSquare, Globe, Maximize2} from 'lucide-react';
            import {useAgent} from '../store/agentStore';

            const TabButton = ({active, icon: Icon, label, onClick }) => (
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

            const CodeView = ({content}) => (
            <div className="p-4 font-mono text-sm text-gray-800 overflow-auto h-full bg-white">
              <pre>{content || '// No code generated yet'}</pre>
            </div>
            );

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
                  Launch Simulator</button>
              </div>
            </div>
            );

            export default function ArtifactViewer() {
  const {state} = useAgent();
            const {artifacts} = state;
            const [activeTab, setActiveTab] = useState('code');

            // Get the first artifact content for demo purposes if multiple exist
            const firstArtifactKey = Object.keys(artifacts)[0];
            const content = firstArtifactKey ? artifacts[firstArtifactKey] : '';

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
                    icon={GitDiff}
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
