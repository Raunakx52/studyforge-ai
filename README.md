# StudyForge AI

StudyForge AI is an AI-powered interactive study assistant built with React and TypeScript. Users enter a topic or paste notes, the app sends the request through a secure Node/Express backend, receives structured JSON from an LLM, validates it, and renders interactive study tools instead of a chat interface.

## New animated hero

This version includes a custom neon light-trail hero inspired by the supplied animation reference. The effect is built with inline SVG, CSS gradients, glow filters, animated paths, moving sparks, background orbs, responsive layout rules, and reduced-motion support. No video background or animation library is required.

## Features

- Animated neon hero with moving light trails
- Responsive desktop and mobile animation layout
- Reduced-motion accessibility support
- React functional components and hooks
- Free-form topic or notes input
- Real LLM integration through an Express backend
- API key kept on the server
- Structured JSON-only generation
- Defensive parsing and shape validation
- Interactive flashcards
- Keyboard controls for flashcards
- Quiz with feedback and wrong-answer re-testing
- Mastery checklist
- Concept chart
- Streaming response transport
- Refinement prompts
- Saved sessions with localStorage
- Light and dark mode
- Loading, slow, error, retry, empty and cancellation states
- Malformed JSON handling
- Wrong-shape handling
- Empty-response handling
- Failed-request handling
- 60-second client timeout
- Stale-response protection
- Production-ready static serving through Express

## Project structure

```text
flam-frontend-assignment/
├── server/
│   └── index.js
├── src/
│   ├── components/
│   │   ├── AnimatedHero.tsx
│   │   ├── PromptInput.tsx
│   │   ├── ResultView.tsx
│   │   ├── FlashcardDeck.tsx
│   │   ├── QuizPanel.tsx
│   │   ├── ChecklistBlock.tsx
│   │   ├── ChartBlock.tsx
│   │   ├── RefinementPanel.tsx
│   │   ├── SessionPanel.tsx
│   │   ├── ErrorState.tsx
│   │   ├── EmptyState.tsx
│   │   └── LoadingState.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── sessions.ts
│   │   └── validateResult.ts
│   ├── types/
│   │   └── result.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## Setup

1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Add your Groq API key.
5. Run `npm run dev` for development.
6. Open `http://localhost:5173`.

## Environment variables

```text
LLM_API_KEY=your_groq_api_key
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=openai/gpt-oss-20b
PORT=8787
```

Do not commit `.env`.

## Development

```bash
npm install
npm run dev
```

The Vite frontend runs on `http://localhost:5173` and proxies `/api` requests to the Express backend on `http://localhost:8787`.

## Production

```bash
npm start
```

`npm start` creates the Vite production build and then serves the generated `dist` folder from the Express server. Open `http://localhost:8787` after the build completes.

For Render:

```text
Build Command: npm install && npm run build
Start Command: node server/index.js
```

Add `LLM_API_KEY`, `LLM_BASE_URL`, and `LLM_MODEL` as environment variables on the hosting platform.

## Animation implementation

The hero animation is implemented in `src/components/AnimatedHero.tsx` and `src/styles.css`.

The visual system includes:

- multiple animated SVG Bézier trails
- magenta, purple, orange and blue gradient strokes
- layered glow filters
- rotating orbit lines
- moving particles using SVG motion paths
- animated background light orbs
- gradient headline text
- glass-style CTA controls
- responsive trail scaling
- `prefers-reduced-motion` support

## AI response flow

```text
User input
    ↓
React frontend
    ↓
Express backend
    ↓
Groq chat-completions API
    ↓
Streaming structured JSON
    ↓
Parse + validate
    ↓
Interactive React components
```

The raw AI response is never directly rendered into the UI.

## Security

The API key is stored only in `.env` or the hosting provider's environment-variable settings. The frontend never receives the API key.

The following are ignored by Git:

```text
.env
node_modules
dist
```

## Known limitations

- AI-generated study content is not independently fact-checked.
- Saved sessions use localStorage and are not synchronized across devices.
- Model availability depends on the configured provider account.
- The neon hero uses SVG filters, so very low-powered devices may render it less smoothly.
- Users who prefer reduced motion receive a mostly static version of the visual effect.
