import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link2, ArrowRight, Copy, Check, QrCode, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { createShortURL, ShortenedURL } from '../lib/supabase';

interface HeroSectionProps {
  user: any;
  onOpenDashboard: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ user, onOpenDashboard }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Input states
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<ShortenedURL | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Framer Motion Scroll animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const heroTextY = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const dashboardY = useTransform(scrollYProgress, [0, 1], [0, -180]);

  // Shorten submit handler
  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await createShortURL(longUrl, customAlias, user?.id);
      setCreatedUrl(result);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFullShortLink = (code: string) => {
    return `${window.location.origin}/#/s/${code}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen pt-24 sm:pt-32 pb-16 overflow-hidden bg-black flex flex-col justify-between"
    >
      {/* Full Page Background Video covering full hero page */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50 filter brightness-90 saturate-125"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
        />
        {/* Full Page Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[600px] h-[350px] bg-gradient-to-tr from-white/10 via-blue-500/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
      </div>

      {/* Hero Text Content Container */}
      <motion.div
        style={{ y: heroTextY, opacity: heroTextOpacity }}
        className="hero-content text-center mt-4 sm:mt-8 md:mt-12 px-4 sm:px-6 max-w-4xl mx-auto z-20 flex flex-col items-center w-full"
      >
        {/* Tag pill: Liquid glass styled */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="liquid-glass inline-flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-lg mb-5 sm:mb-6 shadow-xl max-w-full"
        >
          <span className="bg-white text-black rounded-md text-xs sm:text-sm font-medium px-2 py-0.5 shrink-0">
            New
          </span>
          <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
            Say Hello to Cutter v3.2
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-7xl tracking-[-1.5px] md:tracking-[-2px] font-medium leading-tight md:leading-[1.15] mb-3 text-white max-w-full"
        >
          Your Insights.{' '}
          <span className="font-serif italic font-normal text-white block sm:inline">
            One Clear Overview.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg font-normal leading-normal sm:leading-6 opacity-90 mb-6 sm:mb-8 max-w-2xl text-center px-2"
          style={{ color: 'var(--hero-subtitle)' }}
        >
          Cutter helps teams track metrics, goals, and<br className="hidden sm:inline" />
          {' '}progress with precision using smart link analytics.
        </motion.p>

        {/* Interactive URL Shortener Widget */}
        <motion.div
          id="shortener"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-2xl mb-8 z-30"
        >
          <form onSubmit={handleShorten} className="flex flex-col gap-3">
            <div className="liquid-glass p-2 sm:p-3 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center gap-2.5 shadow-2xl border border-white/15 bg-neutral-950/85 backdrop-blur-xl">
              <div className="flex items-center gap-2 px-3 py-2.5 w-full flex-1 bg-white/5 md:bg-transparent rounded-xl md:rounded-none">
                <Link2 className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  type="url"
                  required
                  placeholder="Paste long URL (e.g. https://mybrand.com/link)..."
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-muted-foreground focus:outline-none text-sm font-medium"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Alias (optional)"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder-muted-foreground w-full sm:w-32 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white text-black hover:bg-white/90 rounded-xl md:rounded-full px-6 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shrink-0 disabled:opacity-50 shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Shorten URL</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Generated Short Link Result Box */}
          {createdUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 rounded-2xl bg-neutral-950/95 border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-xl shadow-2xl text-left"
            >
              <div className="flex flex-col overflow-hidden w-full">
                <span className="text-xs text-amber-400 font-medium flex items-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Shortened Link Created
                </span>
                <a
                  href={getFullShortLink(createdUrl.short_code)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white font-bold text-base sm:text-lg hover:underline truncate"
                >
                  {getFullShortLink(createdUrl.short_code)}
                </a>
                <span className="text-xs text-muted-foreground truncate">
                  Original: {createdUrl.original_url}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <button
                  onClick={() => copyToClipboard(getFullShortLink(createdUrl.short_code))}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white text-black px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-white/90 transition-all shadow-md"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>

                <button
                  onClick={() => setShowQR(!showQR)}
                  className="p-2.5 rounded-xl bg-neutral-800 border border-white/15 hover:bg-neutral-700 text-white transition-colors"
                  title="Show QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>

              {/* QR Code preview */}
              {showQR && (
                <div className="w-full pt-4 border-t border-white/10 flex flex-col items-center justify-center gap-2">
                  <div className="bg-white p-3 rounded-xl shadow-xl">
                    <QRCodeSVG value={getFullShortLink(createdUrl.short_code)} size={130} />
                  </div>
                  <span className="text-xs text-muted-foreground">Scan QR code to open short URL</span>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Dashboard Preview Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative w-full max-w-5xl mx-auto px-4 z-20 mt-4 sm:mt-8"
      >
        <motion.div
          style={{ y: dashboardY }}
          className="relative group rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-neutral-950"
        >
          <img
            src="/hero-dashboard.png"
            alt="Cutter Analytics Dashboard"
            className="w-full h-auto object-cover rounded-2xl sm:rounded-3xl opacity-95 group-hover:opacity-100 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent z-30 pointer-events-none" />
    </section>
  );
};
