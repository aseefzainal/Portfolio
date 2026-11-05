import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const modules = [
  { href: "/admin/profile", title: "Profile", text: "Name, role, links, and GitHub username." },
  { href: "/admin/about", title: "About", text: "Paragraphs and fact cards on the homepage." },
  { href: "/admin/experience", title: "Experience", text: "Work history on the homepage." },
  { href: "/admin/education", title: "Education", text: "Education history on the homepage." },
  {
    href: "/admin/certificates",
    title: "Certificates",
    text: "Licenses and certificates on the homepage.",
  },
  { href: "/admin/projects", title: "Projects", text: "Portfolio projects shown on the site." },
  { href: "/admin/skills", title: "Skills", text: "Stack chips with optional icons." },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">Edit homepage content stored in D1.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {modules.map((module) => (
          <li key={module.href}>
            <Link href={module.href} className="block h-full">
              <Card className="h-full transition-colors hover:bg-muted/40">
                <CardHeader>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>{module.text}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
