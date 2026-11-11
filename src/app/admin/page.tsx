import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const modules = [
  {
    href: "/admin/resume",
    title: "Resume",
    text: "Edit profile, timeline, skills, and projects. Choose what appears on the homepage and resume.",
  },
  { href: "/admin/about", title: "About", text: "Paragraphs and fact cards on the homepage." },
  {
    href: "/admin/showcase",
    title: "Showcase",
    text: "Enable or disable public browser tools like Merge PDF and Split PDF.",
  },
  {
    href: "/admin/messages",
    title: "Messages",
    text: "Read contact form submissions and reply by email.",
  },
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
