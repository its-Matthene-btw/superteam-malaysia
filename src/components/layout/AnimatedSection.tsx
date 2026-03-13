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
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1.0], // Custom easeOut
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
      viewport={{ once: true, amount: 0.05 }}
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