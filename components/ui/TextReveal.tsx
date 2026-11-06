"use client";

import { MotionConfig, motion, type Variants } from "framer-motion";

type TextRevealProps = {
  text: string;
  delay?: number;
  /** Classes de chaque mot : un dégradé `bg-clip-text` doit être posé ici, pas sur un parent. */
  wordClassName?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const word: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.6, ease: EASE } },
};

/** Fait monter les mots un à un à leur entrée dans l'écran — Vengeance UI (stagger-text). */
export default function TextReveal({ text, delay = 0, wordClassName = "" }: TextRevealProps) {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: delay } },
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {text.split(" ").map((part, index) => (
          <span key={`${part}-${index}`}>
            {index > 0 && " "}
            <span className="relative inline-block overflow-hidden pb-[0.12em] align-top">
              <motion.span variants={word} className={`inline-block ${wordClassName}`}>
                {part}
              </motion.span>
            </span>
          </span>
        ))}
      </motion.span>
    </MotionConfig>
  );
}
