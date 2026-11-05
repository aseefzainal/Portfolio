export type Project = {
  title: string;
  description: string;
  stack: string[];
  href?: string;
  repo?: string;
  image?: string;
  mark?: string;
};

export type SkillGroup = {
  name: string;
  items: string[];
};

export type TimelineItem = {
  kind: "Work" | "Education";
  title: string;
  place: string;
  period: string;
  detail: string;
};

export const profile = {
  name: "Aseef Zainal",
  role: "Full-stack developer",
  summary:
    "I build web apps with Laravel and I'm learning Next.js. This page is a placeholder — replace the text, links, and projects with your own.",
  location: "Malaysia",
  email: "aseefzainal65@gmail.com",
  github: "https://github.com/aseefzainal",
  linkedin: "https://www.linkedin.com",
  resume: "/resume.pdf",
  about: [
    "I ship features end to end: database, API, and the screen people actually use. Most of my work so far is Laravel — routing, Eloquent, and Blade — and this portfolio is where I'm practising React and Next.js.",
    "I care about clear structure, readable code, and pages that stay fast on a phone. Swap this copy in src/data/profile.ts when you're ready to publish.",
  ],
  timeline: [
    {
      kind: "Work",
      title: "Full-Stack Developer",
      place: "FMZ Net Solutions · Freelance",
      period: "Aug 2023 – Jul 2025",
      detail: "Freelance full-stack development across web applications.",
    },
    {
      kind: "Education",
      title: "Bachelor in Information Technology (Honours)",
      place: "Universiti Kuala Lumpur MIIT · Internet of Things",
      period: "Sep 2022 – Jul 2025",
      detail: "CGPA 3.53. Completed with a final-year project and industrial training.",
    },
    {
      kind: "Work",
      title: "Backend Developer",
      place: "Politeknik Muadzam Shah · Diploma intern",
      period: "Mar 2022 – Jul 2022",
      detail: "Backend internship at the polytechnic, during the diploma in ICT.",
    },
    {
      kind: "Education",
      title: "Diploma in Information Technology and Communication Technology",
      place: "Politeknik Muadzam Shah",
      period: "Jun 2019 – Aug 2022",
      detail: "CGPA 3.86.",
    },
  ] satisfies TimelineItem[],
  skills: [
    { name: "Backend", items: ["Laravel", "PHP", "MySQL"] },
    {
      name: "Frontend",
      items: ["JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"],
    },
    { name: "Tools", items: ["Git"] },
  ] satisfies SkillGroup[],
  projects: [
    {
      title: "ILMS",
      mark: "ILMS",
      image: "/projects/ilms.svg",
      description:
        "Integrated Land Management System. Staff record premise census and licensing, track billboards, and review coverage on maps and printable reports.",
      stack: ["Laravel", "Livewire", "MySQL"],
    },
    {
      title: "DAMS",
      mark: "DAMS",
      image: "/projects/dams.png",
      description:
        "Door Attendance Management System. It registers staff and visitors, issues QR invitations, and shows live access from door devices.",
      stack: ["Laravel", "Livewire", "MySQL"],
    },
    {
      title: "Capital Park",
      mark: "CP",
      image: "/projects/capital-park.png",
      description:
        "Parking and patrol operations for lot inventory, patroller activity, incidents, payments, and daily summary reports.",
      stack: ["Laravel", "Blade", "MySQL"],
    },
    {
      title: "EPPP",
      mark: "EPPP",
      image: "/projects/eppp.png",
      description:
        "Online procurement for DBKL. Suppliers register their company and bid for supplies, services, and works, with tenders, claims, and project records in one system.",
      stack: ["Laravel", "Blade", "MySQL"],
    },
  ] satisfies Project[],
};
