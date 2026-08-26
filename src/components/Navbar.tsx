import React, { useState } from 'react';
import { ChevronDown, Link2, User, LogOut, LayoutDashboard } from 'lucide-react';

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

  return (
    <header className="w-full fixed top-0 left-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/10">
      <nav className="flex items-center justify-between px-8 md:px-28 py-4 max-w-[1700px] mx-auto">
        {/* Left section: Logo + Title + Nav Links */}
        <div className="flex items-center gap-12 md:gap-20">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/20 p-0.5 bg-gradient-to-b from-white/10 to-transparent">
              <img
                src="/logo.png"
                alt="Cutter Logo"
                className="w-full h-full object-cover rounded"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors">
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
                  <a
                    href="#qr"
                    onClick={() => setServicesOpen(false)}
                    className="flex flex-col gap-0.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white font-medium text-xs">QR Code Studio</span>
                    <span className="text-[11px] text-muted-foreground">Dynamic vector QR codes</span>
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

        {/* Right Section: Sign In / User Actions */}
        <div className="flex items-center gap-3">
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
      </nav>
    </header>
  );
};
