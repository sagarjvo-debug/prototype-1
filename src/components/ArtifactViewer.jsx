import React from 'react';
import { FileText, Code } from 'lucide-react';

export default function ArtifactViewer({ artifacts }) {
    const artifactIds = Object.keys(artifacts || {});

    if (artifactIds.length === 0) {
        return <div className="empty-state">No artifacts generated yet.</div>;
    }

    return (
        <div className="artifact-viewer">
            {artifactIds.map(id => (
                <div key={id} className="artifact-card">
                    <div className="artifact-header">
                        <FileText size={14} />
                        <span>{id}</span>
                    </div>
                    <div className="artifact-body">
                        <pre>{artifacts[id]}</pre>
                    </div>
                </div>
            ))}

            <style>{`
        .empty-state {
          color: var(--text-secondary);
          text-align: center;
          padding: 20px;
          font-size: 13px;
        }
        
        .artifact-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          margin-bottom: 12px;
          overflow: hidden;
        }
        
        .artifact-header {
          background: var(--bg-tertiary);
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .artifact-body {
          padding: 12px;
          overflow-x: auto;
        }
        
        pre {
          font-family: monospace;
          font-size: 12px;
          color: var(--text-secondary);
          white-space: pre-wrap;
        }
      `}</style>
        </div>
    );
}
