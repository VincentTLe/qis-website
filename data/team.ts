export interface TeamMember {
  name: string;
  role: string;
  focus: string;
  bio: string;
  year: string;
  linkedin?: string;
  github?: string;
}

export interface TeamGroup {
  section: string;
  label: string;
  description: string;
  members: TeamMember[];
}

export const teamGroups: TeamGroup[] = [
  {
    section: "executive",
    label: "Executive Board",
    description: "The founding leadership team driving QIS forward.",
    members: [
      {
        name: "TBD",
        role: "President",
        focus: "Strategy & Legitimacy",
        bio: "Responsible for overall club direction, university relations, and long-term strategic vision.",
        year: "Class of 2027",
        linkedin: "#",
      },
      {
        name: "TBD",
        role: "Vice President",
        focus: "Operations & People",
        bio: "Manages day-to-day operations, meeting logistics, and member experience across all programs.",
        year: "Class of 2027",
        linkedin: "#",
      },
      {
        name: "TBD",
        role: "Treasurer",
        focus: "Finance & Compliance",
        bio: "Oversees budget, funding proposals, and ensures compliance with university financial policies.",
        year: "Class of 2028",
        linkedin: "#",
      },
      {
        name: "TBD",
        role: "Director of Programs",
        focus: "Education & Research",
        bio: "Designs and delivers the 10-week algorithm curriculum. Leads research initiatives and study groups.",
        year: "Class of 2027",
        linkedin: "#",
        github: "#",
      },
      {
        name: "TBD",
        role: "Director of External",
        focus: "Competitions & Outreach",
        bio: "Coordinates competition teams, industry partnerships, and external communications.",
        year: "Class of 2028",
        linkedin: "#",
      },
    ],
  },
];

export const allMembers: TeamMember[] = teamGroups.flatMap((g) => g.members);
