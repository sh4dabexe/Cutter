import React, { useEffect, useState } from 'react';
import { recordClick } from '../lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';

export const RedirectHandler: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      const hash = window.location.hash;
      let shortCode: string | null = null;

      if (hash.startsWith('#/s/')) {
        shortCode = hash.replace('#/s/', '').split('?')[0];
      } else {
        const params = new URLSearchParams(window.location.search);
        shortCode = params.get('s') || params.get('code');
      }

      if (!shortCode) return;

      try {
        const targetUrl = await recordClick(shortCode);
        if (targetUrl) {
          window.location.href = targetUrl;
        } else {
          setError(`Short link "${shortCode}" was not found or has expired.`);
        }
      } catch (err) {
        setError('Error resolving short link redirect.');
      }
    };

    handleRedirect();
  }, []);

  const hash = window.location.hash;
  const params = new URLSearchParams(window.location.search);
  const isRedirectRoute = hash.startsWith('#/s/') || params.has('s') || params.has('code');

  if (!isRedirectRoute) return null;

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
