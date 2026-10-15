export type Project = {
  title: string;
  description: string;
  stack: string[];
  href: string;
  repo: string;
};

export const profile = {
  name: "Aseef Zainal",
  role: "Full-stack developer",
  summary:
    "I build web apps with Laravel and I'm learning Next.js. This page is a placeholder — replace the text, links, and projects with your own.",
  location: "Malaysia",
  email: "hello@example.com",
  github: "https://github.com",
  linkedin: "https://www.linkedin.com",
  about: [
    "I ship features end to end: database, API, and the screen people actually use. Most of my work so far is Laravel — routing, Eloquent, and Blade — and this portfolio is where I'm practising React and Next.js.",
    "I care about clear structure, readable code, and pages that stay fast on a phone. Swap this copy in src/data/profile.ts when you're ready to publish.",
  ],
  skills: [
    "Laravel",
    "PHP",
    "MySQL",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Git",
  ],
  projects: [
    {
      title: "Project One",
      description:
        "A short description of what you built, who it was for, and the part you owned.",
      stack: ["Laravel", "MySQL", "Blade"],
      href: "https://github.com",
      repo: "https://github.com",
    },
    {
      title: "Project Two",
      description:
        "Another project. Mention the problem, the approach, and one result you can stand behind.",
      stack: ["PHP", "REST API"],
      href: "https://github.com",
      repo: "https://github.com",
    },
    {
      title: "This portfolio",
      description:
        "A single-page site in the Next.js App Router. Content lives in one data file so the layout stays untouched when you edit copy.",
      stack: ["Next.js", "TypeScript", "Tailwind CSS"],
      href: "https://github.com",
      repo: "https://github.com",
    },
  ] satisfies Project[],
};
