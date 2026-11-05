import { Suspense } from "react";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Suspense
          fallback={
            <section className="border-y border-stone-200 px-5 py-16 dark:border-white/10">
              <p className="mx-auto max-w-5xl text-sm text-stone-500">Loading projects…</p>
            </section>
          }
        >
          <Projects />
        </Suspense>
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
