import { supabase } from "./supabase";

export interface Interaction {
  id?: string;
  event_name: string;
  metadata: Record<string, any>;
  created_at: string;
  session_id: string;
  browser: string;
  os: string;
  screen_size: string;
}

const getOS = () => {
  const ua = navigator.userAgent;
  if (ua.indexOf("Win") !== -1) return "Windows";
  if (ua.indexOf("Mac") !== -1) return "macOS";
  if (ua.indexOf("Linux") !== -1) return "Linux";
  if (ua.indexOf("Android") !== -1) return "Android";
  if (ua.indexOf("like Mac") !== -1) return "iOS";
  return "Unknown OS";
};

const getBrowser = () => {
  const ua = navigator.userAgent;
  if (ua.indexOf("Chrome") !== -1) return "Chrome";
  if (ua.indexOf("Safari") !== -1) return "Safari";
  if (ua.indexOf("Firefox") !== -1) return "Firefox";
  if (ua.indexOf("MSIE") !== -1 || !!(document as any).documentMode) return "IE";
  return "Browser";
};

const getSessionId = () => {
  let sessionId = sessionStorage.getItem("portfolio_session_id");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("portfolio_session_id", sessionId);
  }
  return sessionId;
};

export const trackEvent = async (eventName: string, metadata: Record<string, any> = {}) => {
  const event: Interaction = {
    event_name: eventName,
    metadata: metadata,
    created_at: new Date().toISOString(),
    session_id: getSessionId(),
    browser: getBrowser(),
    os: getOS(),
    screen_size: `${window.innerWidth}x${window.innerHeight}`
  };

  // Log to console for debugging
  console.log(`[Analytics] Event logged: ${eventName}`, metadata);

  try {
    // Attempt Supabase insert
    const { error } = await supabase.from('interactions').insert(event);
    if (error) throw error;
  } catch (e) {
    // Fallback: LocalStorage
    try {
      const local = localStorage.getItem("portfolio_interactions");
      const list = local ? JSON.parse(local) : [];
      list.push({ ...event, id: `local_${Math.random().toString(36).substring(2, 9)}` });
      localStorage.setItem("portfolio_interactions", JSON.stringify(list));
    } catch (err) {
      console.error("Local tracking fallback failed:", err);
    }
  }
};

export const getInteractions = async (): Promise<Interaction[]> => {
  try {
    const { data, error } = await supabase
      .from('interactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (e) {
    // Fallback to LocalStorage
    try {
      const local = localStorage.getItem("portfolio_interactions");
      const list = local ? JSON.parse(local) : [];
      return list.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (err) {
      console.error("Failed to read local interactions:", err);
      return [];
    }
  }
};

export const clearInteractions = async (): Promise<void> => {
  try {
    const { error } = await supabase.from('interactions').delete().neq('id', '0');
    if (error) throw error;
  } catch (e) {
    try {
      localStorage.removeItem("portfolio_interactions");
    } catch (err) {
      console.error("Failed to clear local interactions:", err);
    }
  }
};
