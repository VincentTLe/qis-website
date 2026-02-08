export type EventType = "workshop" | "speaker" | "competition" | "social" | "info-session";

export interface Event {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  tags: string[];
  rsvpUrl?: string;
  speaker?: {
    name: string;
    title: string;
  };
}

export const eventTypeColors: Record<EventType, string> = {
  workshop: "blue",
  speaker: "purple",
  competition: "green",
  social: "orange",
  "info-session": "cyan",
};

export const eventTypeLabels: Record<EventType, string> = {
  workshop: "Workshop",
  speaker: "Speaker",
  competition: "Competition",
  social: "Social",
  "info-session": "Info Session",
};

export const events: Event[] = [
  {
    slug: "intro-options-pricing",
    title: "Intro to Options Pricing Workshop",
    description:
      "Learn the fundamentals of options pricing, from Black-Scholes to binomial trees. Hands-on coding lab included.",
    longDescription:
      "Join us for an intensive workshop on options pricing fundamentals. We'll start with the intuition behind option valuation, derive the Black-Scholes formula from first principles, and implement a binomial tree pricer in Python.\n\nTopics covered:\n- Put-call parity and no-arbitrage arguments\n- The Black-Scholes model: assumptions and derivation\n- Binomial trees for American options\n- Greeks: delta, gamma, theta, vega\n- Hands-on lab: Build your own options pricer\n\nBring your laptop with Python installed. Jupyter notebooks will be provided.",
    date: "2026-03-15",
    time: "6:00 PM - 8:00 PM",
    location: "SMC 210, Knox College",
    type: "workshop",
    tags: ["options", "derivatives", "python"],
    rsvpUrl: "#",
  },
  {
    slug: "jane-street-info-session",
    title: "Jane Street Info Session",
    description:
      "Learn about trading internships and full-time roles at one of the world's top quantitative trading firms.",
    longDescription:
      "Jane Street is a quantitative trading firm with a unique focus on technology and collaborative problem solving. Come hear from a Jane Street recruiter about what it's like to work at one of the top prop trading firms in the world.\n\nThe session will cover:\n- What Jane Street does and how they think about markets\n- Internship and full-time roles for students\n- The interview process and how to prepare\n- Q&A with a current Jane Street trader\n\nOpen to all majors and years. No prior finance experience required.",
    date: "2026-03-22",
    time: "5:00 PM - 6:30 PM",
    location: "Alumni Hall, Knox College",
    type: "info-session",
    tags: ["careers", "trading", "internships"],
    speaker: {
      name: "Sarah Chen",
      title: "Campus Recruiter, Jane Street",
    },
  },
  {
    slug: "pairs-trading-deep-dive",
    title: "Pairs Trading Strategy Deep-Dive",
    description:
      "Build a complete pairs trading pipeline: cointegration testing, dynamic hedge ratios, z-score signals, and walk-forward backtesting.",
    longDescription:
      "This two-part workshop takes you through the complete lifecycle of a pairs trading strategy. We'll start with the statistical foundations and end with a fully backtested pipeline.\n\nPart 1 - Statistical Foundations:\n- Cointegration vs. correlation\n- Engle-Granger and Johansen tests\n- Dynamic hedge ratios with Kalman filters\n\nPart 2 - Strategy Implementation:\n- Z-score signal generation\n- Position sizing and risk management\n- Walk-forward validation framework\n- Avoiding lookahead bias and overfitting\n\nAll code will be in Python using pandas, statsmodels, and our custom backtesting framework.",
    date: "2026-04-05",
    time: "6:00 PM - 8:30 PM",
    location: "SMC 210, Knox College",
    type: "workshop",
    tags: ["pairs-trading", "backtesting", "statistics"],
    rsvpUrl: "#",
  },
  {
    slug: "imc-prosperity-prep",
    title: "IMC Prosperity 4 Prep Session",
    description:
      "Get ready for the next IMC Prosperity competition. Strategy review, team formation, and practice rounds.",
    longDescription:
      "The IMC Prosperity trading competition is one of the most prestigious student trading competitions in the world. Last year, QIS placed in the top 1% out of 12,000+ teams.\n\nThis prep session will cover:\n- Overview of the Prosperity game mechanics\n- Lessons learned from Prosperity 3\n- Market making strategies and order book dynamics\n- Algorithmic trading under latency constraints\n- Team formation and role assignment\n- Practice rounds with our internal simulator\n\nWhether you're a first-time participant or a returning competitor, this session will help you sharpen your strategies.",
    date: "2026-04-12",
    time: "5:00 PM - 7:30 PM",
    location: "SMC 210, Knox College",
    type: "competition",
    tags: ["IMC", "competition", "market-making"],
    rsvpUrl: "#",
  },
  {
    slug: "monte-carlo-workshop",
    title: "Monte Carlo Methods for Portfolio Risk",
    description:
      "Learn to use Monte Carlo simulation for VaR estimation, portfolio optimization, and risk scenario analysis.",
    longDescription:
      "Monte Carlo simulation is one of the most versatile tools in a quant's toolkit. This workshop introduces the method and applies it to real portfolio risk problems.\n\nWhat we'll cover:\n- Random number generation and sampling methods\n- Geometric Brownian Motion for asset prices\n- Value at Risk (VaR) and Conditional VaR estimation\n- Portfolio optimization under uncertainty\n- Stress testing and scenario analysis\n\nWe'll implement everything from scratch in Python and compare results with analytical solutions where possible.",
    date: "2026-04-19",
    time: "6:00 PM - 8:00 PM",
    location: "SMC 210, Knox College",
    type: "workshop",
    tags: ["monte-carlo", "risk", "portfolio"],
    rsvpUrl: "#",
  },
  {
    slug: "quant-trading-panel",
    title: "Quantitative Trading Industry Panel",
    description:
      "Hear from professionals at top quant firms about their career paths, daily work, and advice for aspiring quants.",
    longDescription:
      "An evening panel discussion featuring professionals from the quantitative trading industry. Panelists will share their career journeys, discuss what day-to-day life looks like at a quant firm, and offer advice for students breaking into the field.\n\nPanelists:\n- Quantitative Researcher at a major hedge fund\n- Software Engineer at a proprietary trading firm\n- Risk Analyst at an investment bank\n\nTopics include:\n- Career paths into quantitative finance\n- Technical skills that matter most\n- Interview preparation tips\n- The future of systematic trading\n\nNetworking reception to follow.",
    date: "2026-02-28",
    time: "6:00 PM - 8:00 PM",
    location: "Alumni Hall, Knox College",
    type: "speaker",
    tags: ["careers", "networking", "panel"],
  },
  {
    slug: "spring-social-mixer",
    title: "Spring Social & Game Night",
    description:
      "Relax and connect with fellow QIS members over strategy games, puzzles, and food. All members welcome.",
    longDescription:
      "Take a break from the markets and join us for an evening of strategy games, brain teasers, and socializing. This is a great opportunity to meet other QIS members outside of our regular workshops.\n\nActivities:\n- Strategy board games (Settlers of Catan, Ticket to Ride)\n- Mental math speed challenges\n- Logic puzzle competition\n- Free pizza and refreshments\n\nOpen to all QIS members and friends. No RSVP required, just show up!",
    date: "2026-02-14",
    time: "7:00 PM - 9:00 PM",
    location: "Seymour Union, Knox College",
    type: "social",
    tags: ["social", "networking", "games"],
  },
  {
    slug: "showcase-day-spring-2026",
    title: "Spring 2026 Showcase Day",
    description:
      "End-of-term demos, project presentations, awards, and recruiting kickoff for Fall 2026.",
    longDescription:
      "QIS Spring 2026 Showcase Day marks the culmination of our inaugural term. Members will present their projects, demonstrate trading algorithms, and compete for awards.\n\nSchedule:\n- 5:00 PM - Project presentations and demos\n- 6:30 PM - Awards ceremony\n- 7:00 PM - Fall 2026 recruitment kickoff\n- 7:30 PM - Reception and networking\n\nProjects include pairs trading pipelines, Monte Carlo risk engines, market making bots, and more. Faculty and industry guests are invited to attend.\n\nThis is also the official kickoff for Fall 2026 applications.",
    date: "2026-05-10",
    time: "5:00 PM - 8:00 PM",
    location: "Alumni Hall, Knox College",
    type: "info-session",
    tags: ["showcase", "presentations", "recruiting"],
    rsvpUrl: "#",
  },
];

export function getEventBySlug(slug: string): Event | undefined {
  return events.find((e) => e.slug === slug);
}

export function getUpcomingEvents(): Event[] {
  const now = new Date();
  return events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getPastEvents(): Event[] {
  const now = new Date();
  return events
    .filter((e) => new Date(e.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getRelatedEvents(currentSlug: string, limit = 3): Event[] {
  const current = getEventBySlug(currentSlug);
  if (!current) return [];
  return events
    .filter((e) => e.slug !== currentSlug)
    .filter((e) => e.type === current.type || e.tags.some((t) => current.tags.includes(t)))
    .slice(0, limit);
}
