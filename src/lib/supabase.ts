import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vgnsrptmlypzghpnguoc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbnNycHRtbHlwemdocG5ndW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMTI0NjcsImV4cCI6MjEwMTU4ODQ2N30.lQwtckilbDTpZGgPktappnJviIPDhfIa57qBXgGavx0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ShortenedURL {
  id: string;
  short_code: string;
  original_url: string;
  title?: string;
  clicks: number;
  created_at: string;
  user_id?: string | null;
}

export interface AnalyticsRecord {
  id: string;
  url_id: string;
  clicked_at: string;
  referrer: string;
  country: string;
}

// Generate random short code
export function generateShortCode(length = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Local storage helper key
const LOCAL_STORAGE_KEY = 'cutter_local_urls';
const LOCAL_ANALYTICS_KEY = 'cutter_local_analytics';

export function getLocalURLs(): ShortenedURL[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveLocalURL(urlRecord: ShortenedURL) {
  const existing = getLocalURLs();
  const updated = [urlRecord, ...existing.filter(u => u.id !== urlRecord.id)];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
}

// Supabase + Local persistence operations
export async function createShortURL(originalUrl: string, customAlias?: string, userId?: string | null): Promise<ShortenedURL> {
  // Format target URL if missing protocol
  let target = originalUrl.trim();
  if (!/^https?:\/\//i.test(target)) {
    target = `https://${target}`;
  }

  const short_code = customAlias && customAlias.trim() ? customAlias.trim() : generateShortCode(6);
  const title = new URL(target).hostname.replace('www.', '');

  const newRecord: ShortenedURL = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    short_code,
    original_url: target,
    title,
    clicks: 0,
    created_at: new Date().toISOString(),
    user_id: userId || null
  };

  // Try Supabase first
  try {
    const { data, error } = await supabase
      .from('urls')
      .insert([{
        short_code,
        original_url: target,
        title,
        clicks: 0,
        user_id: userId || null
      }])
      .select()
      .single();

    if (!error && data) {
      saveLocalURL(data);
      return data as ShortenedURL;
    }
  } catch (err) {
    console.warn('Supabase DB offline or unconfigured, using local store:', err);
  }

  // Fallback to local
  saveLocalURL(newRecord);
  return newRecord;
}

export async function fetchUserURLs(userId?: string | null): Promise<ShortenedURL[]> {
  let remoteURLs: ShortenedURL[] = [];
  try {
    let query = supabase.from('urls').select('*').order('created_at', { ascending: false });
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data, error } = await query;
    if (!error && data) {
      remoteURLs = data as ShortenedURL[];
    }
  } catch (err) {
    console.warn('Error fetching remote URLs:', err);
  }

  const localURLs = getLocalURLs();
  // Merge remote and local without duplicates
  const map = new Map<string, ShortenedURL>();
  localURLs.forEach(item => map.set(item.short_code, item));
  remoteURLs.forEach(item => map.set(item.short_code, item));

  return Array.from(map.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function recordClick(shortCode: string): Promise<string | null> {
  const localURLs = getLocalURLs();
  const localMatch = localURLs.find(u => u.short_code === shortCode);

  let targetUrl = localMatch?.original_url || null;
  let urlId = localMatch?.id || null;

  try {
    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .eq('short_code', shortCode)
      .single();

    if (!error && data) {
      targetUrl = data.original_url;
      urlId = data.id;

      // Increment click count in Supabase
      await supabase
        .from('urls')
        .update({ clicks: (data.clicks || 0) + 1 })
        .eq('id', data.id);

      // Log click analytics event
      await supabase.from('url_analytics').insert([{
        url_id: data.id,
        referrer: document.referrer || 'Direct / Social',
        user_agent: navigator.userAgent,
        country: 'Global'
      }]);
    }
  } catch (err) {
    console.warn('Supabase analytics update failed:', err);
  }

  // Update local storage click counter
  if (localMatch) {
    localMatch.clicks = (localMatch.clicks || 0) + 1;
    saveLocalURL(localMatch);
  }

  return targetUrl;
}
