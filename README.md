# StudyForge AI

StudyForge AI is an AI-powered interactive study assistant built with React.

Users can enter a topic or paste study notes, and the application uses a real LLM to generate structured study material including flashcards, quizzes, checklists, and concept visualizations.

The application does not function as a chatbot. AI responses are returned as structured JSON, validated before rendering, and converted into interactive React components.

## Features

- Free-form topic and notes input
- Real LLM integration using Groq
- Backend proxy for secure API-key handling
- Structured JSON generation
- JSON parsing and structural validation
- Interactive flashcards
- Keyboard navigation for flashcards
- Multiple-choice quiz
- Correct and incorrect answer feedback
- Re-test wrong answers
- Interactive mastery checklist
- Concept visualization
- AI-generated study summary
- Refinement of an existing study kit
- Save and reload study sessions
- Streaming AI response transport
- Loading state
- Slow-response handling
- Empty-response handling
- Malformed JSON handling
- Invalid-structure handling
- API and network error handling
- Retry support
- Request timeout
- Stale-response protection
- Dark and light mode
- Responsive mobile design

## Tech Stack

### Frontend

- React
- TypeScript
- React Hooks
- Vite
- CSS

### Backend

- Node.js
- Express
- dotenv
- CORS

### AI

- Groq API
- OpenAI-compatible Chat Completions API
- `openai/gpt-oss-20b`

## Architecture

The browser never communicates directly with the LLM provider.

```text
User
  |
  v
React Frontend
  |
  v
/api/generate
  |
  v
Express Backend
  |
  v
Groq API
  |
  v
Structured JSON
  |
  v
Parse + Validate
  |
  v
Interactive React Components
```

The API key remains on the backend and is never exposed in frontend code.

## Structured AI Output

The model is instructed to return structured JSON containing:

- Title
- Summary
- Flashcards
- Quiz questions
- Checklist items
- Concept chart data

The application does not render the raw model response.

The complete response is first parsed and validated. Only valid structured data is passed to the UI.

## Failure Handling

AI responses are unpredictable, so the application explicitly handles multiple failure scenarios.

### Malformed JSON

If the model returns invalid JSON, the response is rejected and an error state with a retry option is displayed.

### Wrong Structure

Valid JSON that does not contain the required study-kit structure is rejected before reaching the UI.

### Empty Response

An empty model response is treated as an error rather than valid content.

### Failed Request

Network errors and provider failures display an error state instead of crashing the application.

### Slow Response

A loading state is displayed while generation is in progress.

### Timeout

Requests that take too long are automatically cancelled.

### Stale Responses

Each generation request is tracked so that an older slow request cannot overwrite the result of a newer request.

## Project Structure

```text
flam-frontend-assignment/
├── server/
│   └── index.js
│
├── src/
│   ├── components/
│   │   ├── PromptInput.tsx
│   │   ├── ResultView.tsx
│   │   ├── FlashcardDeck.tsx
│   │   ├── QuizPanel.tsx
│   │   ├── ChecklistBlock.tsx
│   │   ├── ChartBlock.tsx
│   │   ├── RefinementPanel.tsx
│   │   ├── SessionPanel.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ErrorState.tsx
│   │   └── EmptyState.tsx
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── sessions.ts
│   │   └── validateResult.ts
│   │
│   ├── types/
│   │   └── result.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Raunakx52/studyforge-ai.git
cd flam-frontend-assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

Create a `.env` file in the root directory.

```env
LLM_API_KEY=your_groq_api_key
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=openai/gpt-oss-20b
PORT=8787
```

Never commit the `.env` file to GitHub.

### 4. Start the application

```bash
npm start
```

For development mode:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

The backend runs at:

```text
http://localhost:8787
```

## Usage

1. Open the application.
2. Enter a study topic or paste notes.
3. Click **Generate study kit**.
4. Wait for the AI response to be generated and validated.
5. Use the generated flashcards to review concepts.
6. Complete the quiz and check answer explanations.
7. Re-test questions answered incorrectly.
8. Mark items in the mastery checklist.
9. View the generated concept visualization.
10. Refine the generated study kit if needed.
11. Save the session for later use.

## Saved Sessions

Generated study kits can be saved locally.

Saved sessions use browser `localStorage`, so they remain available after refreshing the page on the same browser.

No authentication or external database is required.

## Responsive Design

The interface is responsive and adapts to desktop, tablet, and mobile screen sizes.

Interactive elements remain usable on smaller viewports.

## Dark Mode

The application supports light and dark themes.

The theme can be switched using the button in the application header.

## Keyboard Accessibility

Flashcards support keyboard interaction, including navigation and card flipping.

Interactive controls include visible focus states and accessible form elements.

## Security

The Groq API key is stored only in `.env`.

The frontend communicates with the local backend, and the backend communicates with the LLM provider.

The API key is never bundled into the React frontend.

The following files should not be committed:

```text
.env
node_modules/
dist/
```

## AI Usage Note

ChatGPT was used during development to assist with project architecture, implementation guidance, debugging, structured-output handling, failure-case handling, and README preparation.

The generated code and suggestions were reviewed, tested, and adjusted during development. I understand the application architecture, React state flow, backend proxy, LLM request flow, JSON validation, and failure-handling logic and can explain or modify the implementation.

## Known Limitations

- The quality and factual accuracy of study material depends on the selected LLM.
- The application validates the structure of generated content but does not independently fact-check the model response.
- Saved sessions are stored only in browser `localStorage`.
- Saved sessions are not synchronized between devices.
- There is no authentication or user account system.
- An internet connection is required when using the Groq API.
- Model availability can change depending on the LLM provider.
- Extremely large inputs may increase response time.

## Time Spent

Total time spent: 10 HOURS

This includes implementation, API configuration, debugging, testing, and UI refinement.

## Production Build

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Demo

A short screen recording is included with the submission demonstrating:

- Generating a study kit
- Flashcard interaction
- Quiz functionality
- Re-testing incorrect answers
- Checklist interaction
- Concept visualization
- Saving a session
- Refinement
- Dark mode
- Responsive layout
- Error handling

## Author

**Raunak**

Frontend Internship Assignment
