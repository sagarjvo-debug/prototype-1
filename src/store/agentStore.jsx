import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { runSimulationStep } from '../lib/simulator';

const AgentContext = createContext();

const initialState = {
    config: {
        mode: 'L3_OPERATOR', // L0-L5
        reasoningDepth: 'SERIAL', // SERIAL, PARALLEL
        autoRun: false,
    },
    status: 'IDLE', // IDLE, PLANNING, EXECUTING, WAITING_USER
    messages: [
        { id: 'm1', role: 'system', content: 'You are an advanced reasoning assistant.' },
        { id: 'm2', role: 'assistant', content: 'Hello! I am ready to help. What is your goal today?' }
    ],
    tasks: [], // Tree structure of tasks
    trace: [], // Linear log of thoughts/actions
    artifacts: {}, // Map of artifactId -> content
    currentTaskId: null,
};

function agentReducer(state, action) {
    switch (action.type) {
        case 'SET_STATE':
            return { ...state, ...action.payload };
        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };
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
        default:
            return state;
    }
}

export function AgentProvider({ children }) {
    const [state, dispatch] = useReducer(agentReducer, initialState);

    // Simulation Loop
    useEffect(() => {
        if (state.status === 'PLANNING' || state.status === 'EXECUTING') {
            if (state.config.autoRun) {
                const timer = setTimeout(async () => {
                    const nextStep = await runSimulationStep(state);
                    if (nextStep) {
                        dispatch(nextStep);
                    }
                }, 1500); // Delay for "thinking" effect
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
        toggleAutoRun: () => {
            dispatch({
                type: 'UPDATE_CONFIG',
                payload: { autoRun: !state.config.autoRun }
            });
        },
        stepForward: async () => {
            const nextStep = await runSimulationStep(state);
            if (nextStep) dispatch(nextStep);
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
