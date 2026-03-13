'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Reusable component for scroll-based section animations.
 */

interface AnimatedSectionProps extends HTMLMotionProps<'section'> {
  children: ReactNode;
  staggerChildren?: number;
  delay?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (staggerChildren: number) => ({
    opacity: 1,
    transition: {
      staggerChildren: staggerChildren,
      delayChildren: 0.1,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
    },
  },
};

export function AnimatedSection({
  children,
  staggerChildren = 0.1,
  delay = 0,
  className,
  ...props
}: AnimatedSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.01 }}
      variants={containerVariants}
      custom={staggerChildren}
      className={cn("relative z-10", className)}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function AnimatedItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={itemVariants} className={cn("relative z-20", className)}>
      {children}
    </motion.div>
  );
}
