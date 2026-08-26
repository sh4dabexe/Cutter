import React, { useState } from 'react';
import { ChevronDown, Menu, X, LayoutDashboard, LogOut, Link2 } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  user: any;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenDashboard,
  user,
  onSignOut
}) => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 left-0 z-50 backdrop-blur-md bg-black/70 border-b border-white/10">
      <nav className="flex items-center justify-between px-4 sm:px-8 md:px-28 py-3.5 max-w-[1700px] mx-auto">
        {/* Left section: Logo + Title + Desktop Nav Links */}
        <div className="flex items-center gap-6 md:gap-20">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border border-white/20 p-0.5 bg-gradient-to-b from-white/10 to-transparent shrink-0">
              <img
                src="/logo.png"
                alt="Cutter Logo"
                className="w-full h-full object-cover rounded"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors">
              Cutter
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <a
              href="#home"
              className="px-3 py-1.5 rounded-md hover:text-white transition-colors"
            >
              Home
            </a>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:text-white transition-colors"
              >
                Services
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 p-2 rounded-xl bg-neutral-900 border border-white/10 shadow-2xl backdrop-blur-xl z-50">
                  <a
                    href="#shortener"
                    onClick={() => setServicesOpen(false)}
                    className="flex flex-col gap-0.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white font-medium text-xs">URL Shortener</span>
                    <span className="text-[11px] text-muted-foreground">Custom branded short links</span>
                  </a>
                  <a
                    href="#analytics"
                    onClick={() => { setServicesOpen(false); onOpenDashboard(); }}
                    className="flex flex-col gap-0.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white font-medium text-xs">Analytics Dashboard</span>
                    <span className="text-[11px] text-muted-foreground">Real-time click & geolocation metrics</span>
                  </a>
                </div>
              )}
            </div>

            <a
              href="#reviews"
              className="px-3 py-1.5 rounded-md hover:text-white transition-colors"
            >
              Reviews
            </a>

            <a
              href="#contact"
              className="px-3 py-1.5 rounded-md hover:text-white transition-colors"
            >
              Contact us
            </a>
          </div>
        </div>

        {/* Right Section: Desktop User Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenDashboard}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-white/15"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={onSignOut}
                title="Sign Out"
                className="p-2 rounded-lg bg-neutral-900 border border-white/10 hover:bg-neutral-800 text-muted-foreground hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-white text-black hover:bg-white/90 px-5 py-2 rounded-lg text-sm font-semibold transition-opacity duration-200 shadow-md"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-neutral-900 border border-white/10 text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-neutral-950/95 backdrop-blur-xl px-6 py-5 flex flex-col gap-4">
          <a
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-white hover:text-white/80 py-1"
          >
            Home
          </a>
          <a
            href="#shortener"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-white hover:text-white/80 py-1"
          >
            URL Shortener
          </a>
          <a
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-white hover:text-white/80 py-1"
          >
            Reviews
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-white hover:text-white/80 py-1"
          >
            Contact us
          </a>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenDashboard(); }}
                  className="w-full flex items-center justify-center gap-2 bg-white/10 text-white py-2.5 rounded-lg text-sm font-semibold border border-white/15"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Open Dashboard</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onSignOut(); }}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 py-2.5 rounded-lg text-sm font-semibold border border-red-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                className="w-full bg-white text-black py-2.5 rounded-lg text-sm font-semibold text-center"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
