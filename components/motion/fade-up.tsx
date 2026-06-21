"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion/variants";

interface FadeUpProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

export function FadeUp({ className, delay = 0, ...props }: FadeUpProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] as const }}
      {...props}
    />
  );
}
