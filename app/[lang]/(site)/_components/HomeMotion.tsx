"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Animations de l'accueil (D-26) :
 * - `[data-intro="word"]` : mots du slogan qui apparaissent un à un, puis ceux de la ligne
 *   `[data-accent]` qui passent de la couleur du titre au bleu ;
 * - `[data-intro="fade"]` et `[data-intro="photo"]` : texte puis photos du haut de page ;
 * - `[data-count]` : chiffres qui défilent jusqu'à leur valeur ;
 * - `[data-reveal]` : éléments qui apparaissent en entrant à l'écran ;
 * - `[data-parallax]` : photos qui glissent verticalement dans leur cadre au défilement.
 * Quand le système demande de réduire les animations, rien ne se déplace : il ne reste que des
 * fondus, le changement de couleur et les chiffres. Aucun agrandissement dans les deux cas.
 */
export default function HomeMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          full: "(prefers-reduced-motion: no-preference)",
          calm: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const full = Boolean(context.conditions?.full);
          const rtl = document.documentElement.dir === "rtl";
          const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

          if (full) {
            intro
              .fromTo(
                "[data-intro='word']",
                {
                  yPercent: 160,
                  rotate: rtl ? -8 : 8,
                  transformOrigin: rtl ? "100% 100%" : "0% 100%",
                  opacity: 1,
                },
                { yPercent: 0, rotate: 0, duration: 1.1, ease: "expo.out", stagger: 0.09 },
              )
              .fromTo(
                "[data-intro='photo']",
                { clipPath: "inset(100% 0% 0% 0%)", opacity: 1 },
                {
                  clipPath: "inset(0% 0% 0% 0%)",
                  duration: 1.2,
                  ease: "power4.out",
                  stagger: 0.15,
                },
                0.15,
              );
          } else {
            intro
              .fromTo(
                "[data-intro='word']",
                { opacity: 0 },
                { opacity: 1, duration: 0.6, ease: "power1.out", stagger: 0.14 },
              )
              .fromTo(
                "[data-intro='photo']",
                { opacity: 0 },
                { opacity: 1, duration: 0.8, stagger: 0.15 },
                0.2,
              );
          }
          intro.fromTo(
            "[data-intro='fade']",
            { y: full ? 24 : 0, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
            full ? 0.45 : 0.6,
          );

          const title = document.querySelector<HTMLElement>("[data-accent]")?.parentElement;
          if (title) {
            intro.from(
              "[data-accent] [data-intro='word']",
              {
                color: getComputedStyle(title).color,
                duration: 0.7,
                ease: "power2.inOut",
                stagger: 0.14,
                clearProps: "color",
              },
              full ? 0.85 : 0.9,
            );
          }

          for (const element of gsap.utils.toArray<HTMLElement>("[data-count]")) {
            const counter = { value: 0 };
            const target = Number(element.dataset.count);
            intro.to(
              counter,
              {
                value: target,
                duration: 1.4,
                ease: "power2.out",
                onUpdate: () => {
                  element.textContent = String(Math.round(counter.value));
                },
              },
              0.6,
            );
          }

          const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
          const show = (batch: Element[]) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: true,
            });
          gsap.set(reveals, { opacity: 0, y: full ? 32 : 0 });
          ScrollTrigger.batch(reveals, { start: "top 90%", onEnter: show, onEnterBack: show });

          if (full) {
            for (const element of gsap.utils.toArray<HTMLElement>("[data-parallax]")) {
              const distance = Number(element.dataset.parallax);
              gsap.fromTo(
                element,
                { yPercent: -distance },
                {
                  yPercent: distance,
                  ease: "none",
                  scrollTrigger: {
                    trigger: element.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                  },
                },
              );
            }
          }

          // Les onglets et accordéons changent la hauteur de la page : on recalcule les seuils.
          const refresh = gsap.delayedCall(0.2, () => ScrollTrigger.refresh()).pause();
          const observer = new ResizeObserver(() => refresh.restart(true));
          if (root.current) observer.observe(root.current);
          return () => {
            observer.disconnect();
            refresh.kill();
          };
        },
      );
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
