import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TestimonialSection } from './components/TestimonialSection';
import { AuthModal } from './components/AuthModal';
import { DashboardModal } from './components/DashboardModal';
import { RedirectHandler } from './components/RedirectHandler';
import { supabase } from './lib/supabase';
import { Link2, ShieldCheck, Zap, Globe, ArrowRight, Github, Twitter } from 'lucide-react';

export function App() {
  const [user, setUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dashboardModalOpen, setDashboardModalOpen] = useState(false);

  useEffect(() => {
    // Get initial Supabase auth user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Redirect route handler */}
      <RedirectHandler />

      {/* Navigation */}
      <Navbar
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenDashboard={() => setDashboardModalOpen(true)}
        user={user}
        onSignOut={handleSignOut}
      />

      {/* Hero Section */}
      <HeroSection
        user={user}
        onOpenDashboard={() => setDashboardModalOpen(true)}
      />

      {/* Feature Highlights Grid */}
      <section className="py-20 px-8 md:px-28 max-w-[1400px] mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Built for Modern Teams</span>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mt-2 mb-4">
            Everything you need for <span className="font-serif italic text-white font-normal">high performance</span> link management.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="liquid-glass p-8 rounded-3xl bg-neutral-950/60 border border-white/10 flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">Instant Shortening</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create lightning fast custom aliases with automatic metadata parsing and vector QR codes in milliseconds.
            </p>
          </div>

          <div className="liquid-glass p-8 rounded-3xl bg-neutral-950/60 border border-white/10 flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">Geolocation Analytics</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track global clicks, top referrers, traffic origins, and visitor devices with real-time accuracy.
            </p>
          </div>

          <div className="liquid-glass p-8 rounded-3xl bg-neutral-950/60 border border-white/10 flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">Supabase Secured</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Protected by Enterprise Row Level Security, Supabase Auth, and Google OAuth integration.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial Section with Scroll-Driven Word Reveal */}
      <TestimonialSection />

      {/* Footer */}
      <footer id="contact" className="border-t border-white/10 py-16 px-8 md:px-28 bg-neutral-950">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Cutter Logo" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-lg font-bold tracking-tight text-white">Cutter</span>
            <span className="text-xs text-muted-foreground ml-2">© 2026 Cutter SaaS Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#shortener" className="hover:text-white transition-colors">Shortener</a>
            <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
            <button onClick={() => setAuthModalOpen(true)} className="hover:text-white transition-colors">Sign In</button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
          setDashboardModalOpen(true);
        }}
      />

      <DashboardModal
        isOpen={dashboardModalOpen}
        onClose={() => setDashboardModalOpen(false)}
        user={user}
      />
    </div>
  );
}

export default App;
