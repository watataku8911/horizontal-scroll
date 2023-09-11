import Lenis from "@studio-freight/lenis";

import { OverlayScrollbars, ClickScrollPlugin } from "overlayscrollbars";
import "overlayscrollbars/overlayscrollbars.css";

import ScrollTrigger from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

// ------------------------ Lenis(水平スクロール) --------------------
const lenis = new Lenis({
  orientation: "horizontal",
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// ---------------------------- Overlay Scrollbar -----------------------------
OverlayScrollbars.plugin(ClickScrollPlugin);

OverlayScrollbars(document.body, {
  overflow: { y: "hidden" },
  scrollbars: {
    theme: "os-theme-light",
    autoHide: "scroll",
    clickScroll: true,
  },
});

// -------------------- GSAP(テキストアニメーション、ローディングアニメーション) ----------------------
const sections = document.querySelectorAll<HTMLElement>(
  ".container__section__title"
);
sections.forEach((sec) => {
  const text = sec.innerText;
  sec.innerText = "";
  text.split("").forEach((t) => {
    t = t === " " ? "&nbsp;" : t;
    sec.innerHTML += `<span>${t}</span>`;
  });
});

sections.forEach((section) => {
  const texts = section.querySelectorAll<HTMLElement>("span");
  gsap.set(texts, { y: "80%", clipPath: "inset(0 0 100% 0)" });
});

const textAnimations = () => {
  sections.forEach((section) => {
    const texts = section.querySelectorAll<HTMLElement>("span");
    gsap.to(texts, {
      y: 0,
      clipPath: "inset(0 0 0% 0)",
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.03,
      scrollTrigger: {
        trigger: section,
        start: "left center",
        horizontal: true,
      },
    });
  });
};

const loadingAnimation = (props?: { delay?: number; timing?: number }) => {
  const delay = props?.delay ?? 0;
  const timing = props?.timing ?? 1;

  return new Promise((resolve) => {
    const cover = document.querySelector<HTMLElement>(".loading")!;
    const coverText = cover.querySelector<HTMLElement>(".loading__title")!;

    const tl = gsap.timeline({
      delay,
      defaults: { duration: 1, ease: "power2.out" },
    });
    tl.to(coverText, { clipPath: "inset(100% 0 0 0)" });
    tl.to(cover, { clipPath: "inset(0 0 100% 0)" }, "<20%");
    tl.eventCallback("onUpdate", () => {
      if (timing < tl.progress() + 0.01) {
        resolve(null);
      }
    });
    tl.eventCallback("onComplete", () => lenis.start());
  });
};

setTimeout(() => {
  window.scrollTo({ left: 0 });
}, 100);

loadingAnimation({ delay: 0.7, timing: 0.5 }).then(() => {
  textAnimations();
});
