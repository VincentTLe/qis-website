export interface FAQItem {
  question: string;
  answer: string;
}

export const applicationFAQ: FAQItem[] = [
  {
    question: "When do applications open?",
    answer:
      "We recruit at the beginning of each semester. Fall applications typically open in late August, and Spring applications open in early January. Follow us on social media or join our mailing list to get notified.",
  },
  {
    question: "What's the time commitment?",
    answer:
      "QIS meets once a week for 90 minutes. Outside of meetings, expect to spend 2-3 hours per week on labs, readings, and competition prep. During competition season, committed team members may spend additional time.",
  },
  {
    question: "Do I need prior experience in quantitative finance?",
    answer:
      "No prior finance experience is required. We look for strong foundations in math, statistics, or computer science, and a genuine curiosity about markets. Our 10-week curriculum is designed to take you from fundamentals to advanced strategies.",
  },
  {
    question: "What year or major should I be?",
    answer:
      "We welcome students from all years and majors. Most members come from Mathematics, Computer Science, Economics, or Data Science backgrounds, but we've had successful members from Physics, Engineering, and other quantitative fields.",
  },
  {
    question: "What does the application process look like?",
    answer:
      "The process has three stages: (1) Submit a short application form, (2) Complete a brief technical assessment or case study, and (3) A casual conversation with current members. We're looking for intellectual curiosity and collaborative spirit, not perfect answers.",
  },
  {
    question: "How selective is QIS?",
    answer:
      "We aim to maintain a focused, high-quality cohort each semester. While we're selective, we prioritize passion and potential over credentials. If you're genuinely interested in quantitative finance and willing to put in the work, we encourage you to apply.",
  },
  {
    question: "Can I participate in competitions without being a full member?",
    answer:
      "Competition teams are composed of active QIS members who have completed the relevant curriculum modules. This ensures teams have the foundational knowledge needed to compete effectively.",
  },
  {
    question: "What programming languages do you use?",
    answer:
      "Python is our primary language. We use NumPy, pandas, scikit-learn, and statsmodels for quantitative analysis, along with Jupyter notebooks for interactive development. Familiarity with Python is helpful but not strictly required — we'll teach you what you need.",
  },
];
