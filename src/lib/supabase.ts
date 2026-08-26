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
  const updated = [urlRecord, ...existing.filter(u => u.short_code.toLowerCase() !== urlRecord.short_code.toLowerCase())];
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
  let title = 'Shortened Link';
  try {
    title = new URL(target).hostname.replace('www.', '');
  } catch {
    title = target;
  }

  const payload: any = {
    short_code,
    original_url: target,
    title,
    clicks: 0
  };
  if (userId) {
    payload.user_id = userId;
  }

  // Try Supabase insert
  try {
    const { data, error } = await supabase
      .from('urls')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Supabase DB Insert Error:', error.message);
    }

    if (!error && data) {
      saveLocalURL(data);
      return data as ShortenedURL;
    }
  } catch (err) {
    console.warn('Supabase DB insert exception:', err);
  }

  const newRecord: ShortenedURL = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    short_code,
    original_url: target,
    title,
    clicks: 0,
    created_at: new Date().toISOString(),
    user_id: userId || null
  };

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
  localURLs.forEach(item => map.set(item.short_code.toLowerCase(), item));
  remoteURLs.forEach(item => map.set(item.short_code.toLowerCase(), item));

  return Array.from(map.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function recordClick(shortCode: string): Promise<string | null> {
  const cleanCode = shortCode.trim();
  const localURLs = getLocalURLs();
  const localMatch = localURLs.find(u => u.short_code.toLowerCase() === cleanCode.toLowerCase());
  let targetUrl: string | null = localMatch?.original_url || null;

  try {
    // 1. Fetch short URL details from Supabase (case-insensitive)
    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .ilike('short_code', cleanCode)
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      targetUrl = data.original_url;
      const newClicks = (data.clicks || 0) + 1;

      // 2. Perform direct UPDATE for click count in Supabase
      const { error: updateErr } = await supabase
        .from('urls')
        .update({ clicks: newClicks })
        .eq('id', data.id);

      if (updateErr) {
        console.warn('Direct click update warning:', updateErr.message);
        await supabase.rpc('increment_url_clicks', { target_short_code: data.short_code });
      }

      // 3. Log analytics click event
      try {
        await supabase.from('url_analytics').insert([{
          url_id: data.id,
          referrer: document.referrer || 'Direct / Social',
          user_agent: navigator.userAgent,
          country: 'Global'
        }]);
      } catch (analyticsErr) {
        console.warn('Analytics log warning:', analyticsErr);
      }

      // Update local copy if matched
      if (localMatch) {
        localMatch.clicks = newClicks;
        saveLocalURL(localMatch);
      }
    }
  } catch (err) {
    console.warn('Supabase recordClick warning:', err);
  }

  // If local match exists, increment local counter as well
  if (localMatch && !targetUrl) {
    localMatch.clicks = (localMatch.clicks || 0) + 1;
    saveLocalURL(localMatch);
    targetUrl = localMatch.original_url;
  }

  return targetUrl;
}
