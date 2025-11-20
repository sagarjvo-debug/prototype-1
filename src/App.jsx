import React from 'react';
import Shell from './components/Shell';
import { AgentProvider } from './store/agentStore';

function App() {
    return (
        <AgentProvider>
            <Shell />
        </AgentProvider>
    );
}

export default App;
