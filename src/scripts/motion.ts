import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function initMotion() {
  const root = document.documentElement;
  if (root.dataset.motionReady === "true") return () => {};
  root.dataset.motionReady = "true";

  const lenis = new Lenis({ autoRaf: true, lerp: 0.09 });
  lenis.on("scroll", () => {
    ScrollTrigger.update();
  });

  let revert = () => {};
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 12,
          autoAlpha: 0,
          duration: 0.45,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 92%" },
        });
      });
    });
    revert = () => context.revert();
  }

  return () => {
    revert();
    lenis.destroy();
    delete root.dataset.motionReady;
  };
}
