import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const testimonialText = "Cutter revolutionized how we handle financial insights using smart analytics. We are now driving better outcomes quicker than we ever imagined! Cutter revolutionized how we handle financial insights using smart analytics.";
const words = testimonialText.split(" ");

export const TestimonialSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Range where words illuminate sequentially (between 8% and 80% scroll progress)
  // This guarantees 100% of all words are illuminated and readable before the user reaches the footer
  const revealStart = 0.08;
  const revealEnd = 0.8;

  const quoteOpacity = useTransform(scrollYProgress, [revealEnd - 0.04, revealEnd], [0.3, 1]);
  const quoteColor = useTransform(
    scrollYProgress,
    [revealEnd - 0.04, revealEnd],
    ['hsl(0 0% 40%)', 'hsl(0 0% 100%)']
  );

  return (
    <section
      ref={containerRef}
      id="reviews"
      className="relative h-[180vh] sm:h-[200vh] bg-black border-t border-white/5"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center py-16 sm:py-24 px-4 sm:px-8 md:px-28 overflow-hidden">
        <div className="max-w-3xl mx-auto flex flex-col items-start gap-6 sm:gap-10">
          {/* Quote symbol image */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.12], [0.35, 1])
            }}
            className="w-10 sm:w-14 h-8 sm:h-10 flex items-center justify-start"
          >
            <img
              src="/quote-symbol.svg"
              alt="Quote Symbol"
              className="w-10 sm:w-14 h-8 sm:h-10 object-contain"
            />
          </motion.div>

          {/* Scroll-driven word reveal text */}
          <div className="text-2xl sm:text-4xl md:text-5xl font-medium leading-[1.3] sm:leading-[1.2] flex flex-wrap text-white">
            {words.map((word, idx) => {
              const start = revealStart + (idx / words.length) * (revealEnd - revealStart);
              const end = revealStart + ((idx + 1) / words.length) * (revealEnd - revealStart);

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
            <motion.span
              style={{ opacity: quoteOpacity, color: quoteColor }}
              className="ml-1.5 inline-block transition-colors duration-150"
            >
              ”
            </motion.span>
          </div>
        </div>
      </div>
    </section>
  );
};
