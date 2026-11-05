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
import {
  AboutSkeleton,
  ContactSkeleton,
  ContributionsSkeleton,
  HeaderSkeleton,
  HeroSkeleton,
  SectionSkeleton,
  SkillsSkeleton,
} from "@/components/LoadingSkeletons";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";

export default function Home() {
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <main>
        <Suspense fallback={<HeroSkeleton />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<AboutSkeleton />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionSkeleton rows={2} />}>
          <Experience />
        </Suspense>
        <Suspense fallback={<SectionSkeleton rows={2} />}>
          <Education />
        </Suspense>
        <Suspense fallback={<SectionSkeleton rows={2} />}>
          <Certificates />
        </Suspense>
        <Suspense fallback={<SectionSkeleton rows={3} />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SkillsSkeleton />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<ContributionsSkeleton />}>
          <Contributions />
        </Suspense>
        <Suspense fallback={<ContactSkeleton />}>
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
