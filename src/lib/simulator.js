// Mock simulator to generate agent behavior

export async function runSimulationStep(state) {
    const lastMessage = state.messages[state.messages.length - 1];

    // 1. Initial Planning Phase
    if (state.status === 'PLANNING' && state.tasks.length === 0) {
        // Generate a mock plan based on user input
        return {
            type: 'UPDATE_TASKS',
            payload: [
                {
                    id: 't1',
                    title: 'Analyze Request',
                    status: 'completed',
                    subtasks: []
                },
                {
                    id: 't2',
                    title: 'Formulate Strategy',
                    status: 'in_progress',
                    subtasks: [
                        { id: 't2.1', title: 'Research constraints', status: 'pending' },
                        { id: 't2.2', title: 'Draft solution', status: 'pending' }
                    ]
                },
                {
                    id: 't3',
                    title: 'Execute & Verify',
                    status: 'pending',
                    subtasks: []
                }
            ]
        };
    }

    // 2. Execution Phase - Generate Thoughts/Trace
    if (state.status === 'PLANNING' || state.status === 'EXECUTING') {
        // Transition to executing if we have tasks
        if (state.status === 'PLANNING' && state.tasks.length > 0) {
            return { type: 'SET_STATUS', payload: 'EXECUTING' };
        }

        // Generate a random thought or tool call
        const steps = [
            { type: 'ADD_TRACE', payload: { type: 'thought', content: 'Decomposing the problem into sub-components...', timestamp: Date.now() } },
            { type: 'ADD_TRACE', payload: { type: 'thought', content: 'Checking available tools...', timestamp: Date.now() } },
            { type: 'ADD_TRACE', payload: { type: 'tool_call', tool: 'search_knowledge_base', input: '{ "query": "best practices" }', output: 'Found 3 articles.', timestamp: Date.now() } },
            { type: 'ADD_TRACE', payload: { type: 'reflection', content: 'The search results are relevant. I should proceed with the draft.', timestamp: Date.now() } },
            { type: 'UPDATE_ARTIFACT', payload: { id: 'draft_v1.md', content: '# Draft Plan\n\n1. Step one\n2. Step two' } },
        ];

        // Simple random selection for prototype
        const randomStep = steps[Math.floor(Math.random() * steps.length)];
        return randomStep;
    }

    return null;
}
