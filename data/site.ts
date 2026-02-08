export const siteConfig = {
  name: "Quantitative Investment Society",
  shortName: "QIS",
  tagline: "Where quantitative minds converge. Research. Trade. Compete.",
  school: "Knox College",
  location: "Galesburg, Illinois",
  established: 2026,
  advisor: "Prof. Andrew Leahy",
  email: "qis@knox.edu",
  discord: "#",
  github: "https://github.com/VincentTLe/qis-website",
  linkedin: "#",
  instagram: "#",
  applyUrl: "#",
  url: "https://knoxqis.org",
};

export const navLinks = [
  { label: "Events", href: "/events" },
  { label: "Games", href: "/games" },
  { label: "Competition", href: "/competition" },
  { label: "Team", href: "/team" },
  { label: "Join", href: "/join" },
];

export const footerLinks = {
  pages: [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: "Games", href: "/games" },
    { label: "Competition", href: "/competition" },
    { label: "Team", href: "/team" },
  ],
  resources: [
    { label: "Join QIS", href: "/join" },
    { label: "About", href: "/about" },
    { label: "Research", href: "/research" },
    { label: "Contact", href: "/contact" },
    { label: "GitHub", href: "https://github.com/VincentTLe/qis-website" },
  ],
};

export const stats = [
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

export const pillars = [
  {
    number: "01",
    title: "Quantitative Research",
    description:
      "Deep dives into factor models, statistical arbitrage, and alternative data. We study the math first, then build the models.",
    icon: "brain" as const,
  },
  {
    number: "02",
    title: "Algorithmic Trading",
    description:
      "Building and backtesting systematic trading strategies. Monte Carlo simulators, order book engines, and real backtesting pipelines.",
    icon: "code" as const,
  },
  {
    number: "03",
    title: "Competitions",
    description:
      "Participating in intercollegiate quant and trading competitions. IMC Prosperity, Jane Street Puzzles, Optiver, and Citadel challenges.",
    icon: "trophy" as const,
  },
  {
    number: "04",
    title: "Networking & Careers",
    description:
      "Connecting members with quant firms and industry professionals. Resume workshops, mock interviews, and mentorship pipeline.",
    icon: "users" as const,
  },
];
