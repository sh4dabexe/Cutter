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

  const heroTextY = useTransform(scrollYProgress, [0, 0.5], [0, -200]);
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const dashboardY = useTransform(scrollYProgress, [0, 1], [0, -250]);

  // Shorten submit handler
  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await createShortURL(longUrl, customAlias, user?.id);
      setCreatedUrl(result);
      confetti({
        particleCount: 80,
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
      className="relative min-h-screen pt-28 pb-16 overflow-hidden bg-black flex flex-col justify-between"
    >
      {/* Background glow ambient effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-white/10 via-blue-500/5 to-transparent blur-[140px] pointer-events-none rounded-full" />

      {/* Hero Text Content Container */}
      <motion.div
        style={{ y: heroTextY, opacity: heroTextOpacity }}
        className="hero-content text-center mt-8 md:mt-14 px-4 max-w-4xl mx-auto z-20 flex flex-col items-center"
      >
        {/* Tag pill: Liquid glass styled */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="liquid-glass inline-flex items-center gap-2 px-3 py-2 rounded-lg mb-6 shadow-xl"
        >
          <span className="bg-white text-black rounded-md text-sm font-medium px-2 py-0.5">
            New
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            Say Hello to Cutter v3.2
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl tracking-[-2px] font-medium leading-tight md:leading-[1.15] mb-3 text-white"
        >
          Your Insights.{' '}
          <span className="font-serif italic font-normal text-white">
            One Clear Overview.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg font-normal leading-6 opacity-90 mb-8 max-w-2xl text-center"
          style={{ color: 'var(--hero-subtitle)' }}
        >
          Cutter helps teams track metrics, goals, and<br />
          progress with precision using smart link analytics.
        </motion.p>

        {/* Interactive URL Shortener Widget */}
        <motion.div
          id="shortener"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-2xl mb-8"
        >
          <form onSubmit={handleShorten} className="flex flex-col gap-3">
            <div className="liquid-glass p-2 md:p-3 rounded-2xl flex flex-col md:flex-row items-center gap-2 shadow-2xl border border-white/10 bg-neutral-950/80 backdrop-blur-xl">
              <div className="flex items-center gap-2 px-3 py-2 w-full flex-1">
                <Link2 className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  type="url"
                  required
                  placeholder="Paste your long link here (e.g. https://mybrand.com/campaign)..."
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-muted-foreground focus:outline-none text-sm font-medium"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto px-2">
                <input
                  type="text"
                  placeholder="Alias (optional)"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-muted-foreground w-28 md:w-32 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white text-black hover:bg-white/90 rounded-full px-6 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shrink-0 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Get Started for Free</span>
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
              className="mt-4 p-4 rounded-xl bg-neutral-900/90 border border-white/20 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md shadow-2xl"
            >
              <div className="flex flex-col text-left overflow-hidden w-full">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Shortened Link Ready
                </span>
                <a
                  href={getFullShortLink(createdUrl.short_code)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white font-semibold text-lg hover:underline truncate"
                >
                  {getFullShortLink(createdUrl.short_code)}
                </a>
                <span className="text-xs text-muted-foreground truncate">
                  Original: {createdUrl.original_url}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => copyToClipboard(getFullShortLink(createdUrl.short_code))}
                  className="flex items-center gap-1.5 bg-white text-black px-4 py-2 rounded-lg text-xs font-semibold hover:bg-white/90 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>

                <button
                  onClick={() => setShowQR(!showQR)}
                  className="p-2 rounded-lg bg-neutral-800 border border-white/10 hover:bg-neutral-700 text-white transition-colors"
                  title="Show QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>

              {/* QR Modal preview inline */}
              {showQR && (
                <div className="w-full pt-4 border-t border-white/10 flex flex-col items-center justify-center gap-2">
                  <div className="bg-white p-3 rounded-lg">
                    <QRCodeSVG value={getFullShortLink(createdUrl.short_code)} size={130} />
                  </div>
                  <span className="text-xs text-muted-foreground">Scan QR code to visit short URL</span>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Dashboard + Video Area */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative w-screen aspect-video max-h-[700px] mt-10"
        style={{ marginLeft: 'calc(-50vw + 50%)' }}
      >
        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
        />

        {/* Dark Video Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-brightness-90 pointer-events-none" />

        {/* Dashboard image with Parallax Scroll */}
        <motion.div
          style={{ y: dashboardY }}
          className="absolute inset-x-0 top-12 mx-auto max-w-5xl w-[90%] z-20"
        >
          <div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-neutral-950">
            <img
              src="/hero-dashboard.png"
              alt="Cutter Analytics Dashboard"
              className="w-full h-auto object-cover rounded-2xl mix-blend-luminosity opacity-95 group-hover:mix-blend-normal transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          </div>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-30 pointer-events-none" />
      </motion.div>
    </section>
  );
};
