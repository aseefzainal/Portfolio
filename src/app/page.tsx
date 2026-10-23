import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Contributions } from "@/components/Contributions";
import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
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
        <Experience />
        <Education />
        <Projects />
        <Skills />
        <Contributions />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
