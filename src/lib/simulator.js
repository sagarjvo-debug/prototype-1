// Mock simulator to generate agent behavior

export async function runSimulationStep(state) {
    const lastMessage = state.messages[state.messages.length - 1];

    // 1. Initial Planning Phase
    if (state.status === 'PLANNING') {
        // If we don't have a plan yet, generate one and switch to REVIEWING
        if (!state.activePlan) {
            const mockPlan = `# Implementation Plan: ${lastMessage.content.slice(0, 30)}...

## Goal
Address the user's request by implementing the following steps.

## Proposed Changes
### 1. Analysis
- [ ] Analyze requirements
- [ ] Check existing code

### 2. Implementation
- [ ] Create new components
- [ ] Update store logic

## Verification
- [ ] Run automated tests
- [ ] Manual verification
`;

            // Return multiple actions as a batch (simulated by returning an array or just one complex action)
            // For this reducer, we need to dispatch one by one or update reducer to handle arrays.
            // Let's just return the plan generation for now.
            return { type: 'SET_ACTIVE_PLAN', payload: mockPlan };
        }

        // If we have a plan but are still in PLANNING, it means we need to switch to REVIEWING
        return { type: 'SET_STATUS', payload: 'REVIEWING' };
    }

    // 2. Execution Phase
    if (state.status === 'EXECUTING') {
        // Generate tasks if empty
        if (state.tasks.length === 0) {
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
                        title: 'Execute Plan',
                        status: 'in_progress',
                        subtasks: [
                            { id: 't2.1', title: 'Step 1', status: 'pending' },
                            { id: 't2.2', title: 'Step 2', status: 'pending' }
                        ]
                    }
                ]
            };
        }

        // Generate a random thought or tool call
        const steps = [
            { type: 'ADD_TRACE', payload: { type: 'thought', content: 'Executing step 1 of the plan...', timestamp: Date.now() } },
            { type: 'ADD_THOUGHT', payload: { id: Date.now().toString(), type: 'plan', content: 'I am now proceeding with the approved plan.' } },
            { type: 'ADD_TRACE', payload: { type: 'tool_call', tool: 'read_file', input: '{ "path": "src/App.jsx" }', output: 'File content...', timestamp: Date.now() } },
            { type: 'UPDATE_ARTIFACT', payload: { id: 'implementation_plan.md', content: state.activePlan } },
        ];

        const randomStep = steps[Math.floor(Math.random() * steps.length)];
        return randomStep;
    }

    return null;
}
