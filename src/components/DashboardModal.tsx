import React, { useState, useEffect } from 'react';
import { X, Link2, ExternalLink, Copy, Check, BarChart2, QrCode, Search, RefreshCw, Trash2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { fetchUserURLs, deleteShortURL, ShortenedURL } from '../lib/supabase';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export const DashboardModal: React.FC<DashboardModalProps> = ({ isOpen, onClose, user }) => {
  const [urls, setUrls] = useState<ShortenedURL[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeQrCode, setActiveQrCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchUserURLs(user?.id);
      setUrls(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const totalClicks = urls.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  const getFullShortLink = (code: string) => `${window.location.origin}/#/s/${code}`;

  const copyLink = (id: string, code: string) => {
    navigator.clipboard.writeText(getFullShortLink(code));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, shortCode: string) => {
    if (!window.confirm(`Are you sure you want to delete short link "${shortCode}"?`)) return;

    setDeletingId(id);
    try {
      await deleteShortURL(id, shortCode);
      setUrls(prev => prev.filter(item => item.id !== id && item.short_code !== shortCode));
    } catch (err) {
      console.error('Failed to delete URL:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUrls = urls.filter(u =>
    u.original_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.short_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.title && u.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div id="analytics" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
      <div className="liquid-glass w-full max-w-5xl h-[85vh] p-6 md:p-8 rounded-3xl bg-neutral-950/95 border border-white/20 shadow-2xl flex flex-col text-white relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 p-0.5 flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Cutter Analytics Dashboard</h2>
              <p className="text-xs text-muted-foreground">Manage your links and monitor real-time click metrics</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 rounded-lg bg-neutral-900 border border-white/10 hover:bg-neutral-800 text-muted-foreground hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-neutral-900 border border-white/10 hover:bg-neutral-800 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Overview Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 shrink-0">
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 flex flex-col justify-between">
            <span className="text-xs text-muted-foreground font-medium">Total Short Links</span>
            <span className="text-3xl font-bold mt-2 text-white">{urls.length}</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 flex flex-col justify-between">
            <span className="text-xs text-muted-foreground font-medium">Total Clicks Tracked</span>
            <span className="text-3xl font-bold mt-2 text-emerald-400">{totalClicks.toLocaleString()}</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 flex flex-col justify-between">
            <span className="text-xs text-muted-foreground font-medium">Active User Account</span>
            <span className="text-sm font-semibold mt-2 truncate text-muted-foreground">
              {user ? user.email : 'Guest Session (Local Storage)'}
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by URL, short code, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-white/30"
            />
          </div>
        </div>

        {/* Links Table */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-neutral-900/40">
          {loading ? (
            <div className="h-full flex items-center justify-center p-12 text-muted-foreground text-xs">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Loading links...
            </div>
          ) : filteredUrls.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <Link2 className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm font-medium text-white mb-1">No short links created yet</p>
              <p className="text-xs max-w-sm">Use the home shortener box to generate your first custom URL link!</p>
            </div>
          ) : (
            <div className="w-full min-w-[650px]">
              <div className="grid grid-cols-12 px-4 py-3 bg-neutral-900 text-xs font-semibold text-muted-foreground border-b border-white/10 sticky top-0 z-10">
                <div className="col-span-4">Original URL</div>
                <div className="col-span-3">Short Link</div>
                <div className="col-span-2 text-center">Clicks</div>
                <div className="col-span-3 text-right">Actions</div>
              </div>

              <div className="divide-y divide-white/5">
                {filteredUrls.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 px-4 py-3.5 items-center text-xs hover:bg-white/5 transition-colors">
                    <div className="col-span-4 flex flex-col pr-2">
                      <span className="font-medium text-white truncate">{item.title || 'Shortened URL'}</span>
                      <span className="text-muted-foreground text-[11px] truncate">{item.original_url}</span>
                    </div>

                    <div className="col-span-3">
                      <a
                        href={getFullShortLink(item.short_code)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white hover:underline font-semibold flex items-center gap-1 text-xs truncate"
                      >
                        <span>{item.short_code}</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    </div>

                    <div className="col-span-2 text-center font-semibold text-emerald-400">
                      {item.clicks || 0}
                    </div>

                    <div className="col-span-3 flex items-center justify-end gap-2">
                      <button
                        onClick={() => copyLink(item.id, item.short_code)}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors flex items-center gap-1"
                        title="Copy link"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[11px] font-medium">{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => setActiveQrCode(activeQrCode === item.short_code ? null : item.short_code)}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                        title="QR Code"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id, item.short_code)}
                        disabled={deletingId === item.id}
                        className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                        title="Delete short link"
                      >
                        {deletingId === item.id ? (
                          <div className="w-3.5 h-3.5 border border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Inline QR Popup */}
                    {activeQrCode === item.short_code && (
                      <div className="col-span-12 mt-3 p-4 rounded-xl bg-neutral-950 border border-white/10 flex flex-col items-center gap-2">
                        <div className="bg-white p-3 rounded-lg">
                          <QRCodeSVG value={getFullShortLink(item.short_code)} size={120} />
                        </div>
                        <span className="text-[11px] text-muted-foreground">Scan QR code for: {getFullShortLink(item.short_code)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
