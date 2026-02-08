export interface ProbabilityQuestion {
  id: number;
  scenario: string;
  correctAnswer: number; // percentage 0-100
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export const probabilityQuestions: ProbabilityQuestion[] = [
  {
    id: 1,
    scenario: "You roll two fair six-sided dice. What is the probability that the sum is greater than 8?",
    correctAnswer: 27.78,
    explanation: "There are 10 outcomes with sum > 8 out of 36 total: (3,6),(4,5),(4,6),(5,4),(5,5),(5,6),(6,3),(6,4),(6,5),(6,6). So 10/36 = 27.78%.",
    difficulty: "easy",
  },
  {
    id: 2,
    scenario: "A bag contains 5 red balls and 3 blue balls. You draw 2 balls without replacement. What is the probability both are red?",
    correctAnswer: 35.71,
    explanation: "P(both red) = (5/8) * (4/7) = 20/56 = 35.71%.",
    difficulty: "easy",
  },
  {
    id: 3,
    scenario: "You flip a fair coin 4 times. What is the probability of getting exactly 2 heads?",
    correctAnswer: 37.5,
    explanation: "C(4,2) * (0.5)^4 = 6/16 = 37.5%.",
    difficulty: "easy",
  },
  {
    id: 4,
    scenario: "In a room of 23 people, what is the probability that at least two share a birthday? (Assume 365 days)",
    correctAnswer: 50.73,
    explanation: "The birthday problem: P(at least one match) = 1 - (365/365)(364/365)...(343/365) = 50.73%.",
    difficulty: "medium",
  },
  {
    id: 5,
    scenario: "A stock has a 60% chance of going up each day, independently. What is the probability it goes up at least 2 out of 3 days?",
    correctAnswer: 64.8,
    explanation: "P(2 up) + P(3 up) = C(3,2)(0.6)^2(0.4) + (0.6)^3 = 0.432 + 0.216 = 64.8%.",
    difficulty: "medium",
  },
  {
    id: 6,
    scenario: "You have a biased coin that lands heads 70% of the time. If you flip it 5 times, what is the probability of getting exactly 3 heads?",
    correctAnswer: 30.87,
    explanation: "C(5,3) * (0.7)^3 * (0.3)^2 = 10 * 0.343 * 0.09 = 30.87%.",
    difficulty: "medium",
  },
  {
    id: 7,
    scenario: "Two players alternately roll a die. The first to roll a 6 wins. What is the probability that the first player wins?",
    correctAnswer: 54.55,
    explanation: "P = (1/6) + (5/6)(5/6)(1/6) + ... = (1/6) / (1 - 25/36) = 6/11 = 54.55%.",
    difficulty: "hard",
  },
  {
    id: 8,
    scenario: "A trader estimates there's a 40% chance a stock rises, 35% chance it stays flat, and 25% chance it falls. Given it didn't fall, what's the probability it rose?",
    correctAnswer: 53.33,
    explanation: "P(rose | not fell) = P(rose) / P(not fell) = 0.40 / 0.75 = 53.33%.",
    difficulty: "medium",
  },
  {
    id: 9,
    scenario: "You draw 5 cards from a standard 52-card deck. What is the probability of getting at least one ace?",
    correctAnswer: 34.12,
    explanation: "P(at least 1 ace) = 1 - C(48,5)/C(52,5) = 1 - 1712304/2598960 = 34.12%.",
    difficulty: "hard",
  },
  {
    id: 10,
    scenario: "A Monte Carlo simulation runs 1000 paths. If each path has a 1% chance of a tail event, what is the probability that at least 15 paths show the tail event?",
    correctAnswer: 13.17,
    explanation: "This follows a Binomial(1000, 0.01) distribution. Using normal approximation: mean=10, std=3.15. P(X >= 15) = P(Z >= 1.59) = 5.6%. Exact: sum of binomial probabilities = ~13.17%.",
    difficulty: "hard",
  },
  {
    id: 11,
    scenario: "You toss 3 fair coins. What is the probability that all 3 show the same face (all heads or all tails)?",
    correctAnswer: 25,
    explanation: "P(all same) = P(HHH) + P(TTT) = 1/8 + 1/8 = 2/8 = 25%.",
    difficulty: "easy",
  },
  {
    id: 12,
    scenario: "A portfolio has 3 independent positions, each with a 10% chance of default. What is the probability that at least one defaults?",
    correctAnswer: 27.1,
    explanation: "P(at least 1 default) = 1 - P(none default) = 1 - (0.9)^3 = 1 - 0.729 = 27.1%.",
    difficulty: "medium",
  },
];

export interface GameMeta {
  slug: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
}

export const gamesList: GameMeta[] = [
  {
    slug: "mental-math",
    name: "Mental Math",
    description: "60-second speed challenge. Solve as many arithmetic problems as you can before time runs out.",
    icon: "calculator",
    available: true,
  },
  {
    slug: "probability",
    name: "Probability Estimation",
    description: "Estimate probabilities for real quantitative scenarios. Score based on accuracy.",
    icon: "dice",
    available: true,
  },
  {
    slug: "trading-estimation",
    name: "Trading Estimation",
    description: "Estimate fair values under uncertainty. Coming soon.",
    icon: "trending-up",
    available: false,
  },
];
