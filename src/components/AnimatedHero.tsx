export default function AnimatedHero() {
  return (
    <section id="home" className="neon-hero" aria-labelledby="hero-title">
      <div className="hero-noise" aria-hidden="true" />
      <div className="hero-orb hero-orb-one" aria-hidden="true" />
      <div className="hero-orb hero-orb-two" aria-hidden="true" />

      <svg
        className="neon-trails"
        viewBox="0 0 1200 520"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="trail-gradient-a" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff3d00" />
            <stop offset="22%" stopColor="#ff186f" />
            <stop offset="58%" stopColor="#d600ff" />
            <stop offset="100%" stopColor="#7047ff" />
          </linearGradient>
          <linearGradient id="trail-gradient-b" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ff8a00" />
            <stop offset="34%" stopColor="#ff1b93" />
            <stop offset="68%" stopColor="#9d2cff" />
            <stop offset="100%" stopColor="#4a5cff" />
          </linearGradient>
          <filter id="hero-glow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="hero-soft-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="24" />
          </filter>
        </defs>

        <g className="trail-glow-layer" filter="url(#hero-soft-glow)">
          <path className="trail trail-a" d="M-120 280 C 75 78, 302 124, 486 238 S 860 420, 1320 144" />
          <path className="trail trail-b" d="M-80 350 C 150 158, 346 150, 542 258 S 884 354, 1300 246" />
          <path className="trail trail-c" d="M-150 200 C 112 338, 352 82, 566 208 S 920 384, 1340 174" />
        </g>

        <g filter="url(#hero-glow)">
          <path className="trail trail-a trail-core" d="M-120 280 C 75 78, 302 124, 486 238 S 860 420, 1320 144" />
          <path className="trail trail-b trail-core" d="M-80 350 C 150 158, 346 150, 542 258 S 884 354, 1300 246" />
          <path className="trail trail-c trail-core" d="M-150 200 C 112 338, 352 82, 566 208 S 920 384, 1340 174" />
          <path className="trail trail-d trail-core" d="M-100 166 C 130 94, 324 228, 540 192 S 890 92, 1310 324" />
        </g>

        <g className="orbit orbit-one" filter="url(#hero-glow)">
          <ellipse cx="240" cy="260" rx="178" ry="74" />
          <ellipse cx="240" cy="260" rx="124" ry="116" />
        </g>
        <g className="orbit orbit-two" filter="url(#hero-glow)">
          <ellipse cx="984" cy="250" rx="164" ry="76" />
          <ellipse cx="984" cy="250" rx="104" ry="126" />
        </g>

        <circle className="spark spark-one" r="5" fill="#ff9a3c">
          <animateMotion dur="5.8s" repeatCount="indefinite" path="M-60 300 C 160 96, 350 112, 560 246 S 890 406, 1270 142" />
        </circle>
        <circle className="spark spark-two" r="4" fill="#ff53d8">
          <animateMotion dur="7.2s" begin="-2.4s" repeatCount="indefinite" path="M-80 188 C 168 350, 330 90, 560 222 S 922 370, 1280 184" />
        </circle>
        <circle className="spark spark-three" r="3.5" fill="#9b84ff">
          <animateMotion dur="6.4s" begin="-4s" repeatCount="indefinite" path="M-90 356 C 144 164, 348 152, 548 266 S 884 346, 1280 242" />
        </circle>
      </svg>

      <div className="hero-content">
        <div className="hero-kicker">
          <span className="hero-kicker-dot" />
          AI-powered learning workspace
        </div>
        <h1 id="hero-title">
          Learn faster with a <span>study kit that moves with you</span>
        </h1>
        <p>
          Turn any topic or notes into interactive flashcards, quizzes, checklists and concept maps powered by structured AI.
        </p>
        <div className="hero-actions">
          <a className="hero-primary" href="#study-builder">Build my study kit</a>
          <a className="hero-secondary" href="#how-it-works">See how it works</a>
        </div>
        <div className="hero-proof" id="how-it-works">
          <span>Structured JSON</span>
          <span>Validated before render</span>
          <span>Interactive output</span>
        </div>
      </div>
    </section>
  )
}
