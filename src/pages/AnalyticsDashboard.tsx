import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Users, Eye, MousePointerClick, RefreshCw, Database,
  Terminal, TrendingUp, Globe, Monitor, Smartphone, Trash2,
  ArrowLeft, CheckCircle, Clock, BarChart2, Link as LinkIcon,
  Github, Linkedin, Copy, Check, AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";
import { getInteractions, clearInteractions, type Interaction } from "@/lib/analytics";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const SQL_SETUP = `-- Run this in Supabase SQL Editor to enable live tracking
CREATE TABLE IF NOT EXISTS interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT,
  browser TEXT,
  os TEXT,
  screen_size TEXT
);

ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert" ON interactions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon read" ON interactions
  FOR SELECT TO anon USING (true);`;

const ACCENT_COLORS = ["#ff7344", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"];

const StatCard = ({ icon: Icon, label, value, sub, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
  >
    <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20`} style={{ background: color }} />
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
    </div>
    <div className="text-3xl font-display font-bold mb-1">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
    {sub && <div className="text-xs text-muted-foreground/60 mt-1">{sub}</div>}
  </motion.div>
);

const EventFeedItem = ({ event, i }: { event: Interaction; i: number }) => {
  const icons: Record<string, any> = {
    page_view: Eye,
    project_card_click: BarChart2,
    link_click: LinkIcon,
    button_click: MousePointerClick,
    nav_click: Globe,
    contact_click: Activity,
  };
  const Icon = icons[event.event_name] || Activity;
  const colors: Record<string, string> = {
    page_view: "#3b82f6",
    project_card_click: "#ff7344",
    link_click: "#10b981",
    button_click: "#8b5cf6",
    nav_click: "#f59e0b",
    contact_click: "#ec4899",
  };
  const color = colors[event.event_name] || "#6b7280";
  const time = new Date(event.created_at).toLocaleTimeString();
  const meta = event.metadata || {};

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.03 }}
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-foreground">
          {event.event_name.replace(/_/g, " ")}
          {meta.page && <span className="text-muted-foreground"> · {meta.page}</span>}
          {meta.project_title && <span className="text-accent"> · {meta.project_title}</span>}
          {meta.platform && <span className="text-muted-foreground"> · {meta.platform}</span>}
          {meta.target && <span className="text-muted-foreground"> · {meta.target}</span>}
          {meta.method && <span className="text-muted-foreground"> · {meta.method}</span>}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-muted-foreground/60">{time}</span>
          <span className="text-[10px] text-muted-foreground/40">·</span>
          <span className="text-[10px] text-muted-foreground/60">{event.browser}</span>
          <span className="text-[10px] text-muted-foreground/40">·</span>
          <span className="text-[10px] text-muted-foreground/60">{event.os}</span>
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground/40 flex-shrink-0">
        #{event.session_id?.slice(0, 6)}
      </div>
    </motion.div>
  );
};

const AnalyticsDashboard = () => {
  const [events, setEvents] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [usingSupabase, setUsingSupabase] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSQL, setShowSQL] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { supabase } = await import("@/lib/supabase");
      const { data, error } = await supabase.from("interactions").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        setEvents(data);
        setUsingSupabase(true);
      } else {
        throw error;
      }
    } catch {
      // fallback to localStorage
      const local = localStorage.getItem("portfolio_interactions");
      const list = local ? JSON.parse(local) : [];
      setEvents(list.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      setUsingSupabase(false);
    }
    setLastRefresh(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleClear = async () => {
    if (!confirm("Clear all tracked events? This cannot be undone.")) return;
    await clearInteractions();
    fetchData();
  };

  const copySQL = () => {
    navigator.clipboard.writeText(SQL_SETUP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- Derived stats ---
  const totalEvents = events.length;
  const uniqueSessions = new Set(events.map(e => e.session_id)).size;
  const pageViews = events.filter(e => e.event_name === "page_view").length;
  const clickEvents = events.filter(e => e.event_name.includes("click")).length;

  // Event type breakdown
  const eventTypeCounts = events.reduce((acc, e) => {
    acc[e.event_name] = (acc[e.event_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const eventTypeData = Object.entries(eventTypeCounts)
    .map(([name, count]) => ({ name: name.replace(/_/g, " "), count }))
    .sort((a, b) => b.count - a.count);

  // Top projects
  const projectClicks = events
    .filter(e => e.event_name === "page_view" && e.metadata?.page === "project_detail")
    .reduce((acc, e) => {
      const key = e.metadata?.project_title || e.metadata?.project_id || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  const topProjects = Object.entries(projectClicks)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Social link clicks
  const socialClicks = events
    .filter(e => e.event_name === "link_click")
    .reduce((acc, e) => {
      const platform = e.metadata?.platform || "Unknown";
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  // Browser breakdown
  const browserCounts = events.reduce((acc, e) => {
    const b = e.browser || "Unknown";
    acc[b] = (acc[b] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // OS breakdown
  const osCounts = events.reduce((acc, e) => {
    const o = e.os || "Unknown";
    acc[o] = (acc[o] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxBrowser = Math.max(...Object.values(browserCounts), 1);
  const maxOS = Math.max(...Object.values(osCounts), 1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-xl">
        <div className="container px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
              <Activity className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h1 className="font-display font-bold text-base leading-none">Analytics Dashboard</h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {usingSupabase ? (
                  <span className="text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Live from Supabase</span>
                ) : (
                  <span className="text-yellow-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Local session data only</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground hidden sm:block">
              <Clock className="w-3 h-3 inline mr-1" />
              Updated {lastRefresh.toLocaleTimeString()}
            </span>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs bg-secondary px-3 py-1.5 rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 px-3 py-1.5 rounded-lg hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Site
            </Link>
          </div>
        </div>
      </div>

      <div className="container px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Activity} label="Total Events" value={totalEvents} sub="All tracked interactions" color="#ff7344" />
          <StatCard icon={Users} label="Unique Sessions" value={uniqueSessions} sub="Individual visitors" color="#3b82f6" />
          <StatCard icon={Eye} label="Page Views" value={pageViews} sub="Total page impressions" color="#10b981" />
          <StatCard icon={MousePointerClick} label="Click Events" value={clickEvents} sub="Links, buttons, cards" color="#8b5cf6" />
        </div>

        {!usingSupabase && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-300">Supabase table not found — showing local session data only</p>
                  <p className="text-xs text-yellow-400/70 mt-0.5">Create the table to track all visitors across devices in real-time.</p>
                </div>
              </div>
              <button
                onClick={() => setShowSQL(!showSQL)}
                className="flex items-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-300 text-xs px-4 py-2 rounded-lg transition-colors"
              >
                <Terminal className="w-3.5 h-3.5" />
                {showSQL ? "Hide" : "Show"} Setup SQL
              </button>
            </div>

            <AnimatePresence>
              {showSQL && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="relative bg-black/50 rounded-xl border border-white/10 p-4">
                    <button
                      onClick={copySQL}
                      className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <pre className="text-xs text-green-400/80 font-mono overflow-x-auto whitespace-pre-wrap">{SQL_SETUP}</pre>
                  </div>
                  <p className="text-[10px] text-yellow-400/60 mt-2">
                    1. Open Supabase → SQL Editor → paste & run → refresh this page.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Type Breakdown Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-accent" />
                Event Breakdown
              </h3>
              {eventTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={eventTypeData} barCategoryGap="30%">
                    <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#1a1c23", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
                      labelStyle={{ color: "#e5e7eb" }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {eventTypeData.map((_, i) => (
                        <Cell key={i} fill={ACCENT_COLORS[i % ACCENT_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  No events tracked yet. Visit the portfolio to start recording.
                </div>
              )}
            </motion.div>

            {/* Top Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Top Projects Viewed
              </h3>
              {topProjects.length > 0 ? (
                <div className="space-y-3">
                  {topProjects.map((p, i) => {
                    const max = topProjects[0]?.count || 1;
                    return (
                      <div key={p.name} className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-muted-foreground/60 w-4">{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-foreground truncate">{p.name}</span>
                            <span className="text-xs font-bold text-accent ml-2">{p.count}</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(p.count / max) * 100}%` }}
                              transition={{ duration: 0.8, delay: i * 0.1 }}
                              className="h-full rounded-full bg-accent"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No project views recorded yet.</p>
              )}
            </motion.div>

            {/* Social Link Clicks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-accent" />
                Social Link Clicks
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: "GitHub", color: "#2dba4e", icon: Github },
                  { name: "LinkedIn", color: "#0077b5", icon: Linkedin },
                  { name: "Behance", color: "#053eff", icon: Globe },
                ].map(({ name, color, icon: Icon }) => (
                  <div key={name} className="text-center p-4 rounded-xl border border-white/10 bg-white/[0.02]"
                    style={{ borderColor: `${color}30` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-3"
                      style={{ background: `${color}20` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div className="text-2xl font-display font-bold" style={{ color }}>
                      {socialClicks[name] || 0}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">{name} clicks</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Browser / OS breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid sm:grid-cols-2 gap-4"
            >
              <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xs font-bold text-muted-foreground mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Monitor className="w-3.5 h-3.5" /> Browser
                </h3>
                <div className="space-y-3">
                  {Object.entries(browserCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([browser, count], i) => (
                    <div key={browser} className="flex items-center gap-2">
                      <span className="text-xs text-foreground w-16 truncate">{browser}</span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / maxBrowser) * 100}%` }}
                          transition={{ duration: 0.6, delay: i * 0.1 }}
                          className="h-full rounded-full bg-blue-500"
                        />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground w-6 text-right">{count}</span>
                    </div>
                  ))}
                  {Object.keys(browserCounts).length === 0 && <p className="text-xs text-muted-foreground">No data</p>}
                </div>
              </div>

              <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xs font-bold text-muted-foreground mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Smartphone className="w-3.5 h-3.5" /> OS
                </h3>
                <div className="space-y-3">
                  {Object.entries(osCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([os, count], i) => (
                    <div key={os} className="flex items-center gap-2">
                      <span className="text-xs text-foreground w-16 truncate">{os}</span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / maxOS) * 100}%` }}
                          transition={{ duration: 0.6, delay: i * 0.1 }}
                          className="h-full rounded-full bg-purple-500"
                        />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground w-6 text-right">{count}</span>
                    </div>
                  ))}
                  {Object.keys(osCounts).length === 0 && <p className="text-xs text-muted-foreground">No data</p>}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right column — Event Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: "calc(100vh - 160px)", minHeight: 400 }}
          >
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Live Event Feed
              </h3>
              <span className="text-[10px] text-muted-foreground">{events.length} events</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {events.length > 0 ? (
                events.slice(0, 50).map((event, i) => (
                  <EventFeedItem key={event.id || i} event={event} i={i} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Activity className="w-10 h-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">No events yet.</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Visit the portfolio pages to start tracking.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
