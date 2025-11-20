import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { runSimulationStep } from '../lib/simulator';
import { fileSystem } from '../services/FileSystemService';

const AgentContext = createContext();

// Initial state loader
const loadInitialState = () => {
    // Try to load latest conversation
    const files = fileSystem.listFiles('src/data/conversations');
    if (files.length > 0) {
        // Simplified: just load the last one found. In reality, we'd sort by date.
        const latest = files[files.length - 1];
        const data = fileSystem.loadJson(latest);
        if (data) {
            return {
                ...initialState,
                messages: data.messages || initialState.messages,
                thoughts: data.thoughts || [],
                trace: data.trace || [],
                status: 'IDLE' // Always start idle on reload
            };
        }
    }
    return initialState;
};

const initialState = {
    config: {
        mode: 'L3_OPERATOR', // L0-L5
        reasoningDepth: 'SERIAL', // SERIAL, PARALLEL
        autoRun: false,
    },
    status: 'IDLE', // IDLE, PLANNING, REVIEWING, EXECUTING, VERIFYING, COMPLETED
    messages: [
        { id: 'm1', role: 'system', content: 'You are an advanced reasoning assistant.' },
        { id: 'm2', role: 'assistant', content: 'Hello! I am ready to help. What is your goal today?' }
    ],
    tasks: [], // Tree structure of tasks
    trace: [], // Linear log of thoughts/actions
    thoughts: [], // Structured internal monologue
    artifacts: {}, // Map of artifactId -> content
    activePlan: null, // Content of implementation_plan.md during REVIEWING
    currentTaskId: null,
    history: [], // List of past sessions
};

function agentReducer(state, action) {
    switch (action.type) {
        case 'SET_STATE':
            return { ...state, ...action.payload };
        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };
        case 'ADD_THOUGHT':
            return { ...state, thoughts: [...state.thoughts, action.payload] };
        case 'UPDATE_CONFIG':
            return { ...state, config: { ...state.config, ...action.payload } };
        case 'SET_STATUS':
            return { ...state, status: action.payload };
        case 'ADD_TRACE':
            return { ...state, trace: [...state.trace, action.payload] };
        case 'UPDATE_TASKS':
            return { ...state, tasks: action.payload };
        case 'UPDATE_ARTIFACT':
            return {
                ...state,
                artifacts: { ...state.artifacts, [action.payload.id]: action.payload.content }
            };
        case 'SET_ACTIVE_PLAN':
            return { ...state, activePlan: action.payload };
        case 'LOAD_HISTORY':
            return { ...state, history: action.payload };
        default:
            return state;
    }
}

export function AgentProvider({ children }) {
    // Initialize state lazily
    const [state, dispatch] = useReducer(agentReducer, null, loadInitialState);

    // Persistence Effect
    useEffect(() => {
        const sessionId = state.messages[0]?.id || 'default_session'; // Use first message ID as session ID for now
        const path = `src/data/conversations/conv_${sessionId}.json`;

        const dataToSave = {
            conversation_id: sessionId,
            updated_at: new Date().toISOString(),
            messages: state.messages,
            thoughts: state.thoughts,
            trace: state.trace
        };

        // Debounce save could be added here, but for now direct save
        fileSystem.saveJson(path, dataToSave);

        // Also save tasks/brain state
        if (state.tasks.length > 0) {
            fileSystem.saveJson(`src/data/brain/task_${sessionId}.json`, {
                task_id: sessionId,
                status: state.status,
                subtasks: state.tasks
            });
        }

    }, [state.messages, state.thoughts, state.trace, state.tasks, state.status]);

    // Load History Effect
    useEffect(() => {
        const files = fileSystem.listFiles('src/data/conversations');
        dispatch({ type: 'LOAD_HISTORY', payload: files });
    }, []);

    // Simulation Loop
    useEffect(() => {
        if (state.status === 'PLANNING' || state.status === 'EXECUTING' || state.status === 'VERIFYING') {
            if (state.config.autoRun) {
                const timer = setTimeout(async () => {
                    const nextStep = await runSimulationStep(state);
                    if (nextStep) {
                        dispatch(nextStep);
                    }
                }, 1500);
                return () => clearTimeout(timer);
            }
        }
    }, [state]);

    const value = {
        state,
        dispatch,
        sendMessage: (content) => {
            dispatch({
                type: 'ADD_MESSAGE',
                payload: { id: Date.now().toString(), role: 'user', content }
            });
            dispatch({ type: 'SET_STATUS', payload: 'PLANNING' });
        },
        addThought: (content, type = 'plan') => {
            dispatch({
                type: 'ADD_THOUGHT',
                payload: { id: Date.now().toString(), content, type }
            });
        },
        toggleAutoRun: () => {
            dispatch({
                type: 'UPDATE_CONFIG',
                payload: { autoRun: !state.config.autoRun }
            });
        },
        stepForward: async () => {
            const nextStep = await runSimulationStep(state);
            if (nextStep) dispatch(nextStep);
        },
        approvePlan: () => {
            dispatch({ type: 'SET_STATUS', payload: 'EXECUTING' });
            dispatch({
                type: 'ADD_MESSAGE',
                payload: { id: Date.now().toString(), role: 'user', content: 'Plan approved. Proceed.' }
            });
        },
        rejectPlan: (feedback) => {
            dispatch({ type: 'SET_STATUS', payload: 'PLANNING' });
            dispatch({
                type: 'ADD_MESSAGE',
                payload: { id: Date.now().toString(), role: 'user', content: `Plan rejected. Feedback: ${feedback}` }
            });
        }
    };

    return (
        <AgentContext.Provider value={value}>
            {children}
        </AgentContext.Provider>
    );
}

export function useAgent() {
    return useContext(AgentContext);
}
