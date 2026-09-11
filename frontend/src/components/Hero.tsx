import React from 'react';
import { motion } from 'motion/react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #F5F0EB 0%, #FDF0E3 40%, #F5F0EB 100%)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-10 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center min-h-[65vh]">
          
          {/* Left: Text Content */}
          <div className="flex flex-col justify-center">
            <motion.h1
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
              className="font-display text-[38px] sm:text-[46px] md:text-[52px] lg:text-[56px] font-bold text-rf-dark leading-[1.08] tracking-tight"
            >
              The fastest stealth payment API for agents that can't tolerate exposure
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
              className="mt-5 text-[20px] sm:text-[24px] font-display text-rf-dark leading-snug"
            >
              <span className="span-pill orange">Non-custodial</span> ,{' '}
              <span className="span-pill violet">ERC-5564 stealth</span>{' '}
              agent payments with{' '}
              <span className="span-pill blue">99.99% delivery</span> .
            </motion.p>

            {/* CTA Row */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
              className="mt-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border-2 border-rf-orange-light bg-white/40"
            >
              <a href="#developer-api" className="btn-orange whitespace-nowrap text-sm">
                Start for Free
              </a>
              <p className="text-[13px] text-rf-dark/70 leading-relaxed">
                Built by infrastructure engineers running nodes for leading ERC-5564 stealth protocols, AI agent frameworks, and DeFi privacy tools.
              </p>
            </motion.div>
          </div>

          {/* Right: Video — bigger circle, no logo overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] lg:w-[480px] lg:h-[480px]">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-[5px] border-white shadow-lg">
                <div className="absolute inset-[10px] rounded-full overflow-hidden bg-rf-dark">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260603_132049_036591b8-6e92-4760-b94c-a7ea6eef315c.mp4"
                  />
                </div>
              </div>

              {/* Decorative dots */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -top-1 left-1/3 w-2.5 h-2.5 rounded-full bg-rf-violet"
              />
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
                className="absolute top-1/4 -right-2 w-2.5 h-2.5 rounded-full bg-rf-orange"
              />
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-1/4 -left-2 w-2 h-2 rounded-full bg-rf-blue"
              />
              <motion.div
                animate={{ x: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut', delay: 0.3 }}
                className="absolute -bottom-1 right-1/3 w-2.5 h-2.5 rounded-full bg-rf-peach"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
