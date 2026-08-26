import React, { useEffect, useState } from 'react';
import { recordClick } from '../lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';

export const RedirectHandler: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      let shortCode: string | null = null;

      if (hash.startsWith('#/s/')) {
        shortCode = hash.replace('#/s/', '').split('?')[0].split('/')[0].trim();
      } else if (pathname.startsWith('/s/')) {
        shortCode = pathname.replace('/s/', '').split('?')[0].split('/')[0].trim();
      } else if (params.has('s')) {
        shortCode = params.get('s')?.trim() || null;
      } else if (params.has('short')) {
        shortCode = params.get('short')?.trim() || null;
      }

      // Do not treat Supabase OAuth ?code= as a short code
      if (!shortCode) return;

      try {
        const targetUrl = await recordClick(shortCode);
        if (targetUrl) {
          // Redirect immediately to target URL
          window.location.replace(targetUrl);
        } else {
          setError(`Short link "${shortCode}" was not found in database or has expired.`);
        }
      } catch (err) {
        setError('Error resolving short link redirect.');
      }
    };

    handleRedirect();

    // Also listen for dynamic hash/url changes while on the page
    window.addEventListener('hashchange', handleRedirect);
    return () => window.removeEventListener('hashchange', handleRedirect);
  }, []);

  const hash = window.location.hash;
  const pathname = window.location.pathname;
  const params = new URLSearchParams(window.location.search);

  // Exclude Supabase Auth OAuth callbacks (which use ?code= or #access_token=)
  const isShortLinkRoute = hash.startsWith('#/s/') || pathname.startsWith('/s/') || params.has('s') || params.has('short');

  if (!isShortLinkRoute) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white p-6">
      <div className="flex flex-col items-center text-center max-w-sm p-8 rounded-2xl bg-neutral-950 border border-white/10 shadow-2xl">
        {error ? (
          <>
            <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
            <h3 className="text-lg font-bold mb-2">Link Not Found</h3>
            <p className="text-xs text-muted-foreground mb-6">{error}</p>
            <a
              href="/"
              onClick={() => { window.location.hash = ''; window.location.pathname = '/'; }}
              className="bg-white text-black text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-white/90 transition-colors"
            >
              Return to Cutter Home
            </a>
          </>
        ) : (
          <>
            <Loader2 className="w-8 h-8 animate-spin text-white mb-4" />
            <h3 className="text-lg font-semibold tracking-tight">Redirecting...</h3>
            <p className="text-xs text-muted-foreground mt-1">Taking you to your destination link</p>
          </>
        )}
      </div>
    </div>
  );
};
