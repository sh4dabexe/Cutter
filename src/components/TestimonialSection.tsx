import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const testimonialText = "Cutter revolutionized how we handle financial insights using smart analytics. We are now driving better outcomes quicker than we ever imagined! Cutter revolutionized how we handle financial insights using smart analytics.";
const words = testimonialText.split(" ");

export const TestimonialSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end center'],
  });

  return (
    <section
      ref={containerRef}
      id="reviews"
      className="min-h-[80vh] flex items-center justify-center py-16 sm:py-24 md:py-32 px-4 sm:px-8 md:px-28 bg-black relative border-t border-white/5"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-start gap-6 sm:gap-10">
        {/* Quote symbol image */}
        <div className="w-10 sm:w-14 h-8 sm:h-10 flex items-center justify-start">
          <img
            src="/quote-symbol.svg"
            alt="Quote Symbol"
            className="w-10 sm:w-14 h-8 sm:h-10 object-contain opacity-80"
          />
        </div>

        {/* Scroll-driven word reveal text */}
        <div className="text-2xl sm:text-4xl md:text-5xl font-medium leading-[1.3] sm:leading-[1.2] flex flex-wrap text-white">
          {words.map((word, idx) => {
            const start = idx / words.length;
            const end = (idx + 1) / words.length;

            const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
            const color = useTransform(
              scrollYProgress,
              [start, end],
              ['hsl(0 0% 35%)', 'hsl(0 0% 100%)']
            );

            return (
              <motion.span
                key={idx}
                style={{ opacity, color }}
                className="mr-[0.25em] inline-block transition-colors duration-150"
              >
                {word}
              </motion.span>
            );
          })}
          <span className="text-muted-foreground ml-1.5">”</span>
        </div>

        {/* Author Row */}
        <div className="flex items-center gap-3.5 mt-2">
          <img
            src="/testimonial-avatar.png"
            alt="Brooklyn Simmons"
            className="w-12 sm:w-14 h-12 sm:h-14 rounded-full border-[3px] border-foreground object-cover shadow-lg shrink-0"
          />
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-semibold leading-snug text-foreground">
              Brooklyn Simmons
            </span>
            <span className="text-xs sm:text-sm font-normal leading-tight text-muted-foreground">
              Product Manager
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
