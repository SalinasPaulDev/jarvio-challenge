# 🚀 Vibe Canvas

A powerful visual workflow automation platform that allows you to create, configure, and execute complex data processing pipelines through an intuitive drag-and-drop interface.

![Vibe Canvas](https://img.shields.io/badge/Status-Active%20Development-brightgreen)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.2-purple)

## ✨ Features

- **🎨 Visual Workflow Builder**: Drag and drop blocks to create complex automation workflows
- **🔧 Block Configuration**: Configure each block with specific parameters and settings
- **⚡ Real-time Execution**: Run your workflows and see real-time progress tracking
- **📊 Process Monitoring**: Track execution status with detailed step-by-step progress
- **🔗 Smart Dependencies**: Automatic dependency resolution and execution ordering
- **🎯 Multiple Integrations**: Support for Amazon Sales, AI Agents, Gmail, and Slack

## 🏗️ Architecture

Vibe Canvas is built with a modern, scalable architecture:

- **Frontend**: React 19 with TypeScript for type safety
- **State Management**: Zustand for lightweight, efficient state management
- **Visual Flow**: ReactFlow for powerful node-based UI components
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: CSS Modules for component-scoped styling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/vibe-canvas.git
   cd vibe-canvas
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🎯 How to Use

### 1. Create Your Workflow

1. **Drag blocks** from the left palette onto the canvas
2. **Connect blocks** by dragging from one block's output to another's input
3. **Configure each block** by clicking on it to open the configuration modal

### 2. Available Block Types

| Block Type       | Description                     | Configuration               |
| ---------------- | ------------------------------- | --------------------------- |
| **Amazon Sales** | Fetch sales data from Amazon    | Metric type, timeframe      |
| **AI Agent**     | Process data with AI analysis   | System prompt               |
| **Gmail**        | Send email notifications        | Recipient, subject, message |
| **Slack**        | Send messages to Slack channels | Channel, message content    |

### 3. Execute Your Workflow

1. Click the **"Run Test"** button in the top-left corner
2. Watch the **real-time progress** in the process tracker
3. Monitor each block's execution status and results

## 🛠️ Technology Stack

### Core Technologies

- **React 19.1.1** - Modern React with latest features
- **TypeScript 5.8.3** - Type-safe JavaScript development
- **Vite 7.1.2** - Fast build tool and dev server

### Key Libraries

- **React-flow** - Powerful node-based UI framework
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icon library

### Development Tools

- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── blocks/          # Block components and styles
│   ├── common/          # Shared UI components
│   ├── config/          # Configuration modals
│   └── customEdge/      # Custom edge components
├── hooks/               # Custom React hooks
├── store/               # Zustand stores
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── assets/              # Static assets
```

## 🔧 Configuration

### Block Configuration

Each block type has its own configuration interface:

- **Amazon Sales**: Configure metrics (revenue, units sold, orders) and timeframe
- **AI Agent**: Set up system prompts for AI analysis
- **Gmail**: Configure recipient, subject, and message body
- **Slack**: Set channel and message content

### State Management

The application uses multiple Zustand stores:

- `configStore` - Block configurations
- `processTrackerStore` - Execution progress tracking
- `modalStore` - Modal state management
- `completionStore` - Block completion validation

## 🎨 Customization

### Adding New Block Types

1. Define the block type in `src/types/blocks.ts`
2. Add block metadata in `src/utils/blocks.ts`
3. Create the block component in `src/components/blocks/`
4. Add configuration modal in `src/components/config/`

### Styling

The application uses CSS Modules for component-scoped styling. Each component has its own `.css` file for isolated styling.

## 🙏 Acknowledgments

- [ReactFlow](https://reactflow.dev/) for the amazing node-based UI framework
- [Zustand](https://zustand-demo.pmnd.rs/) for simple and effective state management
- [Lucide](https://lucide.dev/) for the beautiful icon set

---

**This project was created by Brian Paul Salinas to complete the challenge from Jarvio company, demonstrating best practices and technology management. Excited to be part of the team and contribute with energy and motivation. If you like it, please add a ⭐ to the repository!**
