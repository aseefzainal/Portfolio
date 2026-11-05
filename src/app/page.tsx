import { Suspense } from "react";
import { About } from "@/components/About";
import { Certificates } from "@/components/Certificates";
import { Contact } from "@/components/Contact";
import { Contributions } from "@/components/Contributions";
import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";

function SectionFallback({ label }: { label: string }) {
  return (
    <section className="px-5 py-12 sm:py-16">
      <p className="mx-auto max-w-3xl text-sm text-muted-foreground">Loading {label}…</p>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Suspense fallback={<header className="h-14 border-b" />}>
        <Header />
      </Suspense>
      <main>
        <Suspense fallback={<SectionFallback label="hero" />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<SectionFallback label="about" />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionFallback label="experience" />}>
          <Experience />
        </Suspense>
        <Suspense fallback={<SectionFallback label="education" />}>
          <Education />
        </Suspense>
        <Suspense fallback={<SectionFallback label="certificates" />}>
          <Certificates />
        </Suspense>
        <Suspense fallback={<SectionFallback label="projects" />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SectionFallback label="skills" />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<SectionFallback label="contributions" />}>
          <Contributions />
        </Suspense>
        <Suspense fallback={<SectionFallback label="contact" />}>
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
