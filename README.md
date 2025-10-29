# NexusAI: A Conversational AI Interface

An elegant, minimalist, and high-performance conversational AI interface powered by Cloudflare Agents, mirroring the sophisticated design of modern AI chat applications.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Brajesh2022/nexusai-a-conversational-ai-interface)

## Key Features

- **Sophisticated UI**: A visually stunning and high-performance interface inspired by the latest ChatGPT design.
- **Session Management**: A collapsible sidebar for elegant and intuitive chat session management.
- **Real-time Responses**: Fluid, real-time streaming of AI responses for a seamless conversational experience.
- **Stateful Backend**: Powered by the Cloudflare Agents SDK and Durable Objects for persistent, stateful conversations.
- **Responsive Perfection**: Flawlessly responsive design ensuring a premium experience across desktop, tablet, and mobile devices.
- **Modern Tech Stack**: Built with shadcn/ui, Tailwind CSS, and Zustand for a robust and maintainable codebase.

## Technology Stack

- **Frontend**:
  - React & Vite
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - Zustand (State Management)
  - Framer Motion (Animations)
  - Lucide React (Icons)
- **Backend**:
  - Cloudflare Workers
  - Hono (Web Framework)
  - Cloudflare Agents SDK
  - Durable Objects (State Persistence)
- **AI Integration**:
  - OpenAI SDK
  - Cloudflare AI Gateway

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- A [Cloudflare account](https://dash.cloudflare.com/sign-up).
- The [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) authenticated with your Cloudflare account.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/nexus_ai_chat.git
    cd nexus_ai_chat
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

### Configuration

The application requires Cloudflare AI Gateway credentials to function.

1.  **Create a `.dev.vars` file** in the root of the project for local development:
    ```ini
    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
    CF_AI_API_KEY="your-cloudflare-api-key"
    ```
    Replace the placeholder values with your actual Cloudflare Account ID, Gateway ID, and an API key.

2.  For production, you will need to set these as secrets in your Cloudflare Worker dashboard.

## Development

To run the application in development mode with hot-reloading:

```bash
bun run dev
```

This command starts the Vite development server for the frontend and the Wrangler development server for the backend worker simultaneously. The application will be available at `http://localhost:3000`.

## Usage

- **Start a Conversation**: Simply type a message in the input box at the bottom and press Enter.
- **New Chat**: Click the "New Chat" button to start a fresh conversation. This creates a new session.
- **Switch Sessions**: Click on a past conversation in the sidebar to load its history and continue the chat.
- **Model Selection**: Use the dropdown menu to switch between available AI models for the current conversation.

## Deployment

Deploying the application to Cloudflare is a single command.

1.  **Build and deploy the application:**
    ```bash
    bun run deploy
    ```
    This command will build the frontend application, then deploy both the static assets and the worker to your Cloudflare account.

2.  **Or, deploy with a single click:**

    [![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Brajesh2022/nexusai-a-conversational-ai-interface)

## Important Note

Please be aware that this project utilizes AI models through Cloudflare's AI Gateway. There is a hard limit on the number of requests that can be made to the AI servers across all users in a given time period. During periods of high traffic, you may experience rate limiting.