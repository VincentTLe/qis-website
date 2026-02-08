export interface Competition {
  slug: string;
  name: string;
  organizer: string;
  description: string;
  format: string;
  teamSize: string;
  timeline: string;
  website: string;
  featured: boolean;
  results?: { year: string; placement: string; details: string }[];
  tags: string[];
}

export const competitions: Competition[] = [
  {
    slug: "imc-prosperity",
    name: "IMC Prosperity",
    organizer: "IMC Trading",
    description:
      "A multi-day algorithmic trading simulation where teams build automated trading strategies across multiple products. Compete against 12,000+ teams from top universities worldwide.",
    format: "5-day algorithmic trading simulation with multiple trading rounds",
    teamSize: "Teams of 1-4",
    timeline: "March - April annually",
    website: "https://prosperity.imc.com",
    featured: true,
    results: [
      {
        year: "2025",
        placement: "Top 1%",
        details: "Ranked in the top 1% out of 12,000+ teams globally using pairs trading and market making strategies.",
      },
    ],
    tags: ["algorithmic-trading", "market-making", "pairs-trading"],
  },
  {
    slug: "jane-street-puzzles",
    name: "Jane Street Puzzles",
    organizer: "Jane Street",
    description:
      "Monthly mathematical puzzles and brain teasers from one of the world's top quantitative trading firms. Challenges test probability, combinatorics, and creative problem-solving.",
    format: "Monthly puzzle challenges with leaderboard",
    teamSize: "Individual",
    timeline: "Monthly, year-round",
    website: "https://www.janestreet.com/puzzles",
    featured: false,
    tags: ["math", "puzzles", "probability"],
  },
  {
    slug: "optiver-ready-trader-go",
    name: "Optiver Ready Trader Go",
    organizer: "Optiver",
    description:
      "A simulated exchange environment where teams build algorithmic market-making strategies. Focus on order book dynamics, latency optimization, and risk management.",
    format: "Algorithmic market-making competition on simulated exchange",
    teamSize: "Teams of 2-4",
    timeline: "February - March annually",
    website: "https://readytradergo.optiver.com",
    featured: false,
    tags: ["market-making", "algorithmic-trading", "exchange"],
  },
  {
    slug: "citadel-datathon",
    name: "Citadel Datathon",
    organizer: "Citadel / Citadel Securities",
    description:
      "A data science competition focused on extracting insights from real-world financial datasets. Teams build predictive models and present findings to Citadel researchers.",
    format: "Data science hackathon with presentation",
    teamSize: "Teams of 2-4",
    timeline: "Fall semester annually",
    website: "https://www.citadel.com",
    featured: false,
    tags: ["data-science", "machine-learning", "finance"],
  },
];

export function getCompetitionBySlug(slug: string): Competition | undefined {
  return competitions.find((c) => c.slug === slug);
}
