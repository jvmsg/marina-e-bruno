"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/motion/variants";

interface StaggerChildrenProps extends HTMLMotionProps<"div"> {
  stepKey?: string | number;
}

export function StaggerChildren({
  className,
  stepKey,
  children,
  ...props
}: StaggerChildrenProps) {
  return (
    <motion.div
      key={stepKey}
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  className,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={cn(className)}
      variants={staggerItem}
      {...props}
    />
  );
}
