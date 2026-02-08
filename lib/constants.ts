export const SITE_CONFIG = {
  name: "Quantitative Investment Society",
  shortName: "QIS",
  tagline: "We Learn. We Build. We Compete.",
  school: "Knox College",
  location: "Galesburg, Illinois",
  established: 2026,
  advisor: "Prof. Andrew Leahy",
  email: "qis@knox.edu",
  discord: "#",
  github: "#",
  applyUrl: "#",
};

export const STATS = [
  {
    value: 1,
    suffix: "%",
    label: "IMC Prosperity 3",
    sublabel: "out of 12,000+ teams",
  },
  {
    value: 18,
    suffix: "%",
    label: "Backtested Returns",
    sublabel: "Pairs Trading Pipeline",
  },
  {
    value: 10,
    suffix: "-Week",
    label: "Algo Curriculum",
    sublabel: "Structured Program",
  },
  {
    value: 5,
    suffix: "",
    label: "Core Leadership",
    sublabel: "Founding Officers",
  },
];

export const CREDENTIALS = [
  {
    tag: "> COMPETITION",
    title: "Top 1% — IMC Prosperity 3",
    body: "Ranked in the top 1% globally out of 12,000+ teams. Built pairs-trading algorithms using statistical arbitrage and mean-reversion strategies under simulated exchange conditions.",
  },
  {
    tag: "> RESEARCH",
    title: "Pairs Trading Pipeline · 18% Returns",
    body: "End-to-end pipeline: cointegration testing, dynamic hedge ratios, z-score signal generation, and rigorous backtesting with walk-forward validation. No curve-fitting. No vibes.",
  },
  {
    tag: "> FOUNDATION",
    title: "Mathematics & Data Science",
    body: "Grounded in probability theory, statistical inference, and machine learning. Every strategy we teach comes with math first, code second, and a hygiene checklist third.",
  },
  {
    tag: "> OPEN SOURCE",
    title: "Everything Ships to GitHub",
    body: "Notes, notebooks, simulators, scoreboards — all version-controlled, all runnable from a clean checkout. Your portfolio grows every week you participate.",
  },
];

export const PHILOSOPHY_PILLARS = [
  {
    number: "01",
    title: "Learn",
    body: "Weekly concept blocks — probability, market microstructure, options, Greeks, risk metrics. One clean example. One worked proof. No fluff.",
    output: "output → 1-page note + definitions",
  },
  {
    number: "02",
    title: "Build",
    body: "Hands-on labs every meeting. Monte Carlo simulators, order book engines, backtesting pipelines. Teams of 2–4. PRs merged before you leave.",
    output: "output → runnable notebook + merged PR",
  },
  {
    number: "03",
    title: "Compete",
    body: "Internal leaderboards. Mock interviews. Competition prep for IMC Prosperity, Jane Street puzzles, Optiver challenges. Points for shipping and helping — not ego.",
    output: "output → scoreboards + demos",
  },
];

export const CURRICULUM_WEEKS = [
  {
    week: 1,
    title: "Kickoff + Tools + Quant Mindset",
    artifact: "repo + metrics notebook",
    highlight: true,
  },
  {
    week: 2,
    title: "Probability & Expected Value",
    artifact: "Monte Carlo sim + write-up",
  },
  {
    week: 3,
    title: "Market Microstructure Basics",
    artifact: "order book sim + scoreboard",
  },
  {
    week: 4,
    title: "Options 101: Payoffs & Parity",
    artifact: "payoff / parity lab",
  },
  {
    week: 5,
    title: "Greeks & Hedging (Light Week)",
    artifact: "finite-diff Greeks + hedge game",
  },
  {
    week: 6,
    title: "Volatility + Risk Metrics",
    artifact: "risk report notebook",
  },
  {
    week: 7,
    title: "Backtesting Hygiene",
    artifact: "leak demo + hygiene checklist",
  },
  {
    week: 8,
    title: "Competition Sprint",
    artifact: "prototype + README",
  },
  {
    week: 9,
    title: "Showcase Day",
    artifact: "demos + awards + recruiting",
    highlight: true,
  },
];

export const MEETING_BLOCKS = [
  {
    time: "0–10",
    label: "WARM-UP",
    description: "Mental math + team puzzles",
    emphasis: false,
  },
  {
    time: "10–30",
    label: "LEARN",
    description: "One concept, one clean example",
    emphasis: false,
  },
  {
    time: "30–75",
    label: "BUILD",
    description: "Lab / simulator / notebook",
    emphasis: true,
  },
  {
    time: "75–90",
    label: "COMPETE",
    description: "Scoreboard + mock interviews",
    emphasis: false,
  },
];

export const ROADMAP = [
  {
    phase: "SPRING 2026",
    title: "Beta Launch",
    active: true,
    items: [
      "Kick-off / Demo Day event",
      "Core team recruitment",
      "Constitution ratified",
      "Advisor confirmed: Prof. Andrew Leahy",
    ],
  },
  {
    phase: "FALL 2026",
    title: "Full 10-Week Algo Curriculum",
    active: false,
    items: [
      "Weekly Learn → Build → Compete meetings",
      "Competition team formation (IMC, Optiver)",
      "GitHub showcase portfolio",
      "Internal leaderboard + points system",
    ],
  },
  {
    phase: "2027+",
    title: "Scale & Specialize",
    active: false,
    items: [
      "Project pods: equities, derivatives, market making",
      "Campus-wide quant challenge",
      "Alumni network & mentorship pipeline",
    ],
  },
];

export const TEAM = [
  { role: "President", focus: "Strategy + Legitimacy", name: "TBD" },
  { role: "Vice President", focus: "Operations + People", name: "TBD" },
  { role: "Treasurer", focus: "Finance + Compliance", name: "TBD" },
  {
    role: "Director of Programs",
    focus: "Education + Research",
    name: "TBD",
  },
  {
    role: "Director of External",
    focus: "Competitions + Outreach",
    name: "TBD",
  },
];

export const TECH_TOOLS = [
  "Python",
  "NumPy",
  "pandas",
  "scikit-learn",
  "Jupyter",
  "GitHub",
  "LaTeX",
  "Google Colab",
];

export const COMPETITION_TARGETS = [
  "IMC Prosperity",
  "Jane Street Puzzles",
  "Optiver",
  "Citadel",
];

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Join", href: "#join" },
];
