# Voice Coach

This is a web application designed to help users improve their communication skills. It provides a platform for users to practice their speech and receive feedback.

## Key Technologies

*   **Frontend:**
    *   React
    *   React Router
    *   Tailwind CSS
    *   Vite
*   **Backend:**
    *   Node.js
    *   Express
*   **API:**
    *   Google Generative AI
    *   OpenAI

## Getting Started

### Prerequisites

*   Node.js and npm installed on your machine.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/voice-coach.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd voice-coach
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

```bash
npm run dev
```

This will start the development server and open the application in your default browser at `http://localhost:5173`.

## Project Structure

The project is organized as follows:

*   `public/`: Contains public assets, including audio files.
*   `src/`: Contains the main source code for the application.
    *   `api/`: Contains the API client for communicating with the backend.
    *   `components/`: Contains reusable UI components.
    *   `hooks/`: Contains custom React hooks.
    *   `pages/`: Contains the main pages of the application.
    *   `providers/`: Contains React context providers.
*   `vite.config.js`: Vite configuration file.
*   `tailwind.config.js`: Tailwind CSS configuration file.

## Available Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the application for production.
*   `npm run preview`: Previews the production build locally.