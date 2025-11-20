# Reasoning Agent App - Prototype 1 (v1.0.0)

This is the first prototype of the Advanced Reasoning Chat Assistant. It demonstrates the core UI components and the visualization of the agent's reasoning process.

## Features

### 1. Task Tree Visualization
- Visualizes the decomposition of user requests into a hierarchy of tasks and sub-tasks.
- Shows the status of each task (pending, running, completed, failed).
- Allows users to understand the agent's plan at a glance.

### 2. Thinking Panel
- Displays the "brain" of the agent.
- Shows the internal monologue, reasoning steps, and reflections.
- Provides transparency into *why* the agent is taking specific actions.

### 3. Artifact Viewer
- A dedicated panel to view artifacts created by the agent (e.g., code files, plans, diagrams).
- Supports syntax highlighting for code.

### 4. Interactive Shell
- A command-line interface for users to interact with the agent.
- Supports natural language input.

### 5. Simulator
- Includes a simulator to demonstrate the agent's behavior with mock data.
- Allows testing the UI flows without a live backend.

## Tech Stack
- **Frontend**: React, Vite
- **Styling**: Tailwind CSS (via `index.css`)
- **State Management**: Custom Store (`agentStore.jsx`)

## Getting Started

1.  Clone the repository.
2.  Run `npm install` to install dependencies.
3.  Run `npm run dev` to start the development server.
