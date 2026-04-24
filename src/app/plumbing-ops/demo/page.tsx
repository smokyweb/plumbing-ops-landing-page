'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  LayoutDashboard, MapIcon, Package, Clock, Users, DollarSign,
  Briefcase, Target, Star, Phone, AlertTriangle, MapPin,
  ScanLine, ArrowRightLeft, RotateCcw, Wrench, X, TrendingUp,
} from 'lucide-react';
import clsx from 'clsx';

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

type Tab = 'dashboard' | 'dispatch' | 'inventory' | 'payroll' | 'membership';

interface Job {
  id: number;
  customer: string;
  address: string;
  type: string;
  priority: 'normal' | 'high' | 'emergency';
  status: 'unassigned' | 'assigned' | 'in-progress' | 'complete';
  techId: number | null;
  revenue: number;
  time: string;
}

interface Tech {
  id: number;
  name: string;
  role: string;
  color: string;
}

interface VanPart {
  name: string;
  qty: number;
}

interface Van {
  id: number;
  label: string;
  techId: number;
  parts: VanPart[];
}

interface TimeClock {
  date: string;
  clockIn: string;
  clockOut: string | null;
  location: string;
  anomaly?: boolean;
}

interface Member {
  id: number;
  name: string;
  plan: string;
  mrr: number;
  nextService: string;
  status: 'active' | 'overdue' | 'expiring';
}

/* ═══════════════════════════════════════════
   SEED DATA
   ═══════════════════════════════════════════ */

const TECHS: Tech[] = [
  { id: 1, name: 'John Smith', role: 'Senior Tech', color: '#0ea5e9' },
  { id: 2, name: 'Maria Garcia', role: 'Lead Tech', color: '#8b5cf6' },
  { id: 3, name: 'Jake Wilson', role: 'Tech II', color: '#f59e0b' },
  { id: 4, name: 'Derek Brown', role: 'Tech I', color: '#10b981' },
  { id: 5, name: 'Aisha Patel', role: 'Tech II', color: '#ec4899' },
  { id: 6, name: 'Tommy Chen', role: 'Apprentice', color: '#f97316' },
];

const SEED_JOBS: Job[] = [
  { id: 1, customer: 'Robert Taylor', address: '1423 Clinch Ave, Knoxville, TN', type: 'Water Heater Replacement', priority: 'normal', status: 'unassigned', techId: null, revenue: 2800, time: '9:00 AM' },
  { id: 2, customer: 'Susan Clark', address: '302 Gay St, Knoxville, TN', type: 'Drain Cleaning', priority: 'normal', status: 'unassigned', techId: null, revenue: 350, time: '10:30 AM' },
  { id: 3, customer: 'James Miller', address: '4520 Western Ave, Knoxville, TN', type: 'Faucet Install', priority: 'normal', status: 'unassigned', techId: null, revenue: 425, time: '11:00 AM' },
  { id: 4, customer: 'Patricia Lee', address: '6200 Papermill Dr, Knoxville, TN', type: 'Toilet Repair', priority: 'high', status: 'unassigned', techId: null, revenue: 275, time: '1:00 PM' },
  { id: 5, customer: 'William Davis', address: '3301 Sutherland Ave, Knoxville, TN', type: 'Gas Line Inspection', priority: 'normal', status: 'unassigned', techId: null, revenue: 550, time: '2:30 PM' },
  { id: 6, customer: 'Linda Johnson', address: '5812 Kingston Pike, Knoxville, TN', type: 'Sewer Line Repair', priority: 'high', status: 'assigned', techId: 1, revenue: 4200, time: '8:00 AM' },
  { id: 7, customer: 'Michael Brown', address: '8901 Chapman Hwy, Knoxville, TN', type: 'Bathroom Remodel Rough-in', priority: 'normal', status: 'in-progress', techId: 2, revenue: 6500, time: '7:30 AM' },
  { id: 8, customer: 'Karen White', address: '2145 Cumberland Ave, Knoxville, TN', type: 'Water Softener Install', priority: 'normal', status: 'assigned', techId: 3, revenue: 1800, time: '9:00 AM' },
  { id: 9, customer: 'David Martinez', address: '714 Market St, Knoxville, TN', type: 'Garbage Disposal Replace', priority: 'normal', status: 'assigned', techId: 4, revenue: 380, time: '10:00 AM' },
  { id: 10, customer: 'Jennifer Anderson', address: '1100 Broadway, Knoxville, TN', type: 'Pipe Leak Repair', priority: 'normal', status: 'in-progress', techId: 5, revenue: 650, time: '8:30 AM' },
];

const SEED_VANS: Van[] = [
  { id: 1, label: 'Van #101', techId: 1, parts: [{ name: '50-gal Water Heater', qty: 1 }, { name: '3/4" Copper Pipe (10ft)', qty: 4 }, { name: 'SharkBite Fitting', qty: 12 }, { name: 'PVC Cement', qty: 2 }] },
  { id: 2, label: 'Van #102', techId: 2, parts: [{ name: 'Toilet Wax Ring', qty: 6 }, { name: '1/2" PEX Tubing (100ft)', qty: 2 }, { name: 'Ball Valve 3/4"', qty: 8 }, { name: 'Teflon Tape', qty: 10 }] },
  { id: 3, label: 'Van #103', techId: 3, parts: [{ name: 'Kitchen Faucet (Moen)', qty: 2 }, { name: 'Supply Line 3/8"', qty: 6 }, { name: 'P-Trap 1-1/2"', qty: 4 }, { name: 'Plumber Putty', qty: 3 }] },
  { id: 4, label: 'Van #104', techId: 4, parts: [{ name: 'Garbage Disposal 1/2HP', qty: 1 }, { name: 'Drain Snake 25ft', qty: 1 }, { name: 'Pipe Wrench 14"', qty: 2 }, { name: 'Flux Paste', qty: 2 }] },
  { id: 5, label: 'Van #105', techId: 5, parts: [{ name: 'Water Softener Tank', qty: 1 }, { name: 'Bypass Valve Kit', qty: 2 }, { name: 'Solder Roll', qty: 3 }, { name: 'Pipe Cutter', qty: 1 }] },
  { id: 6, label: 'Van #106', techId: 6, parts: [{ name: 'Apprentice Tool Kit', qty: 1 }, { name: 'Teflon Tape', qty: 5 }, { name: 'Channel Locks', qty: 2 }, { name: 'Pipe Dope', qty: 2 }] },
];

const JOHN_TIMECLOCK: TimeClock[] = [
  { date: 'Mon 4/20', clockIn: '7:02 AM', clockOut: '4:58 PM', location: '1423 Clinch Ave, Knoxville' },
  { date: 'Tue 4/21', clockIn: '6:58 AM', clockOut: '5:12 PM', location: '5812 Kingston Pike, Knoxville' },
  { date: 'Wed 4/22', clockIn: '7:05 AM', clockOut: '4:45 PM', location: '302 Gay St, Knoxville' },
  { date: 'Thu 4/23', clockIn: '7:00 AM', clockOut: '5:30 PM', location: 'Nashville, TN', anomaly: true },
  { date: 'Fri 4/24', clockIn: '7:10 AM', clockOut: null, location: '8901 Chapman Hwy, Knoxville' },
];

const OTHER_TIMECLOCK: TimeClock[] = [
  { date: 'Mon 4/20', clockIn: '7:00 AM', clockOut: '5:00 PM', location: 'Knoxville, TN' },
  { date: 'Tue 4/21', clockIn: '7:05 AM', clockOut: '4:55 PM', location: 'Knoxville, TN' },
  { date: 'Wed 4/22', clockIn: '6:55 AM', clockOut: '5:10 PM', location: 'Knoxville, TN' },
  { date: 'Thu 4/23', clockIn: '7:00 AM', clockOut: '5:00 PM', location: 'Knoxville, TN' },
  { date: 'Fri 4/24', clockIn: '7:08 AM', clockOut: null, location: 'Knoxville, TN' },
];

const SEED_MEMBERS: Member[] = [
  { id: 1, name: 'Thompson Residence', plan: 'Gold', mrr: 49, nextService: '2026-05-10', status: 'active' },
  { id: 2, name: 'Oakwood Apartments', plan: 'Platinum', mrr: 199, nextService: '2026-04-15', status: 'overdue' },
  { id: 3, name: 'Davis Family', plan: 'Silver', mrr: 29, nextService: '2026-06-01', status: 'active' },
  { id: 4, name: 'Riverside Office Park', plan: 'Platinum', mrr: 299, nextService: '2026-05-20', status: 'active' },
  { id: 5, name: 'Chen Household', plan: 'Gold', mrr: 49, nextService: '2026-04-28', status: 'expiring' },
  { id: 6, name: 'Martin Duplex', plan: 'Silver', mrr: 29, nextService: '2026-07-15', status: 'active' },
  { id: 7, name: 'Westside Commercial', plan: 'Platinum', mrr: 299, nextService: '2026-05-05', status: 'active' },
  { id: 8, name: 'Park Place Condos', plan: 'Gold', mrr: 49, nextService: '2026-06-12', status: 'active' },
];

const LEAD_SOURCE = [
  { name: 'Google Ads', value: 35 },
  { name: 'Referral', value: 25 },
  { name: 'Nextdoor', value: 18 },
  { name: 'Repeat', value: 15 },
  { name: 'Yelp', value: 7 },
];
const PIE_COLORS = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

const TECH_CHART = [
  { name: 'John', jobs: 6, revenue: 9200 },
  { name: 'Maria', jobs: 5, revenue: 11500 },
  { name: 'Jake', jobs: 4, revenue: 5800 },
  { name: 'Derek', jobs: 3, revenue: 3200 },
  { name: 'Aisha', jobs: 5, revenue: 7400 },
  { name: 'Tommy', jobs: 2, revenue: 1800 },
];

const RANDOM_PARTS = [
  '3/4" Ball Valve', 'PEX Crimp Ring', 'Hose Bib', 'Expansion Tank',
  'PRV Valve', 'Flapper Valve', 'Supply Line', 'Copper Elbow 90°',
  'PVC Coupling 2"', 'Gas Flex Line', 'Drain Cover', 'Wax Ring',
];

/* ═══════════════════════════════════════════
   SIDEBAR CONFIG
   ═══════════════════════════════════════════ */

const TABS: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'dispatch', label: 'Dispatch Board', icon: MapIcon },
  { key: 'inventory', label: 'Van Inventory', icon: Package },
  { key: 'payroll', label: 'Time & Payroll', icon: Clock },
  { key: 'membership', label: 'Membership Plans', icon: Users },
];

/* ═══════════════════════════════════════════
   SMALL COMPONENTS
   ═══════════════════════════════════════════ */

function KpiCard({ icon: Icon, label, value, sub }: { icon: typeof DollarSign; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wide">
        <Icon size={14} /> {label}
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{ backgroundColor: color + '22', color }}
    >
      {children}
    </span>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.dataKey === 'revenue' ? `$${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ═══════════════════════════════════════════
   QUOTE BUILDER
   ═══════════════════════════════════════════ */

function QuoteBuilder({ job, onClose }: { job: Job; onClose: () => void }) {
  const base = job.revenue;
  const options = [
    { tier: 'Good', price: base, desc: 'Standard repair with 90-day warranty', color: '#10b981' },
    { tier: 'Better', price: Math.round(base * 1.4), desc: 'Premium parts + 1-year warranty + priority scheduling', color: '#f59e0b' },
    { tier: 'Best', price: Math.round(base * 1.85), desc: 'Top-tier parts + 2-year warranty + annual maintenance plan', color: '#0ea5e9' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">{job.type}</h3>
            <p className="text-sm text-muted-foreground">{job.customer} &mdash; {job.address}</p>
            <p className="text-xs text-muted-foreground mt-1">Scheduled: {job.time}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-muted text-muted-foreground"><X size={18} /></button>
        </div>

        <h4 className="text-sm font-semibold text-foreground mb-3">Quote Builder</h4>
        <div className="grid grid-cols-3 gap-3">
          {options.map(o => (
            <div key={o.tier} className="rounded-xl border-2 p-4 flex flex-col gap-2 cursor-pointer hover:scale-[1.02] transition-transform" style={{ borderColor: o.color }}>
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: o.color }}>{o.tier}</span>
              <span className="text-2xl font-bold text-foreground">${o.price.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground leading-relaxed">{o.desc}</span>
              <button className="mt-auto rounded-lg py-1.5 text-xs font-semibold text-white" style={{ backgroundColor: o.color }}>
                Select {o.tier}
              </button>
            </div>
          ))}
        </div>

        {job.techId && (
          <div className="mt-4 text-xs text-muted-foreground">
            Assigned to: <span className="text-foreground font-medium">{TECHS.find(t => t.id === job.techId)?.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

export default function DemoPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [jobs, setJobs] = useState<Job[]>(SEED_JOBS);
  const [vans, setVans] = useState<Van[]>(SEED_VANS.map(v => ({ ...v, parts: v.parts.map(p => ({ ...p })) })));
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedTech, setSelectedTech] = useState<number>(1);
  const [members] = useState<Member[]>(SEED_MEMBERS);
  const [nextId, setNextId] = useState(11);

  // Transfer state
  const [transferFrom, setTransferFrom] = useState(1);
  const [transferTo, setTransferTo] = useState(2);
  const [transferPart, setTransferPart] = useState('');

  const reset = useCallback(() => {
    setJobs(SEED_JOBS);
    setVans(SEED_VANS.map(v => ({ ...v, parts: v.parts.map(p => ({ ...p })) })));
    setSelectedJobId(null);
    setSelectedTech(1);
    setNextId(11);
    setTab('dashboard');
  }, []);

  const addEmergency = useCallback(() => {
    const ej: Job = {
      id: nextId,
      customer: 'EMERGENCY — Burst Pipe',
      address: '921 Sevier Ave, Knoxville, TN',
      type: 'Emergency Pipe Burst',
      priority: 'emergency',
      status: 'unassigned',
      techId: null,
      revenue: 1500,
      time: 'NOW',
    };
    setJobs(prev => [ej, ...prev]);
    setNextId(n => n + 1);
  }, [nextId]);

  const assignJob = useCallback((jobId: number, techId: number) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, techId, status: 'assigned' } : j));
  }, []);

  const scanBarcode = useCallback((vanId: number) => {
    const part = RANDOM_PARTS[Math.floor(Math.random() * RANDOM_PARTS.length)];
    setVans(prev => prev.map(v => {
      if (v.id !== vanId) return v;
      const existing = v.parts.find(p => p.name === part);
      if (existing) {
        return { ...v, parts: v.parts.map(p => p.name === part ? { ...p, qty: p.qty + 1 } : p) };
      }
      return { ...v, parts: [...v.parts, { name: part, qty: 1 }] };
    }));
  }, []);

  const transferParts = useCallback(() => {
    if (!transferPart || transferFrom === transferTo) return;
    setVans(prev => {
      const fromVan = prev.find(v => v.id === transferFrom);
      const fromPart = fromVan?.parts.find(p => p.name === transferPart);
      if (!fromPart || fromPart.qty < 1) return prev;
      return prev.map(v => {
        if (v.id === transferFrom) {
          return { ...v, parts: v.parts.map(p => p.name === transferPart ? { ...p, qty: p.qty - 1 } : p).filter(p => p.qty > 0) };
        }
        if (v.id === transferTo) {
          const ex = v.parts.find(p => p.name === transferPart);
          if (ex) return { ...v, parts: v.parts.map(p => p.name === transferPart ? { ...p, qty: p.qty + 1 } : p) };
          return { ...v, parts: [...v.parts, { name: transferPart, qty: 1 }] };
        }
        return v;
      });
    });
    setTransferPart('');
  }, [transferFrom, transferTo, transferPart]);

  // Derived
  const unassigned = jobs.filter(j => j.status === 'unassigned');
  const todayRevenue = jobs.filter(j => j.status !== 'unassigned').reduce((s, j) => s + j.revenue, 0);
  const openJobs = jobs.filter(j => j.status !== 'complete').length;
  const avgTicket = Math.round(todayRevenue / Math.max(jobs.filter(j => j.techId).length, 1));
  const selectedJob = jobs.find(j => j.id === selectedJobId) ?? null;
  const mrrTotal = members.reduce((s, m) => s + m.mrr, 0);

  const timeclock = selectedTech === 1 ? JOHN_TIMECLOCK : OTHER_TIMECLOCK;

  /* ─── RENDERERS ─────────────────────────── */

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard icon={DollarSign} label="Today Revenue" value={`$${todayRevenue.toLocaleString()}`} sub="+12% vs last Thu" />
        <KpiCard icon={Briefcase} label="Open Jobs" value={String(openJobs)} sub={`${unassigned.length} unassigned`} />
        <KpiCard icon={TrendingUp} label="Avg Ticket" value={`$${avgTicket.toLocaleString()}`} sub="Target: $1,200" />
        <KpiCard icon={Target} label="Close Rate" value="74%" sub="▲ 3pp this week" />
        <KpiCard icon={Star} label="Reviews" value="12" sub="4.8 avg ★" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Lead Sources</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={LEAD_SOURCE} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`} fontSize={11}>
                {LEAD_SOURCE.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Jobs by Technician</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TECH_CHART}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="jobs" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Jobs" />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderDispatch = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Dispatch Board</h2>
        <button onClick={addEmergency} className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition">
          <Phone size={14} /> Emergency Call
        </button>
      </div>

      <div className="grid md:grid-cols-[320px_1fr] gap-4">
        {/* Unassigned */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Unassigned ({unassigned.length})</h3>
          {unassigned.length === 0 && <p className="text-xs text-muted-foreground py-4 text-center">All jobs assigned!</p>}
          {unassigned.map(j => (
            <div key={j.id} className={clsx('rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition', j.priority === 'emergency' ? 'border-red-500 bg-red-500/10' : j.priority === 'high' ? 'border-amber-500/50' : 'border-border')}>
              <div className="flex items-start justify-between">
                <div>
                  <p className={clsx('text-sm font-semibold', j.priority === 'emergency' && 'text-red-400')}>{j.type}</p>
                  <p className="text-xs text-muted-foreground">{j.customer}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin size={10} />{j.address}</p>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{j.time}</span>
              </div>
              <div className="mt-2 flex gap-1 flex-wrap">
                {TECHS.map(t => (
                  <button key={t.id} onClick={() => assignJob(j.id, t.id)} className="rounded px-2 py-0.5 text-[10px] font-medium border border-border hover:bg-muted transition" title={`Assign to ${t.name}`}>
                    {t.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tech schedule */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 overflow-x-auto">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Technician Schedule</h3>
          {TECHS.map(t => {
            const techJobs = jobs.filter(j => j.techId === t.id);
            return (
              <div key={t.id} className="flex items-center gap-3 rounded-lg border border-border p-2 hover:bg-muted/30 transition">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                <div className="w-24 shrink-0">
                  <p className="text-sm font-medium truncate">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.role}</p>
                </div>
                <div className="flex gap-1.5 flex-wrap flex-1">
                  {techJobs.length === 0 && <span className="text-xs text-muted-foreground italic">No jobs</span>}
                  {techJobs.map(j => (
                    <button key={j.id} onClick={() => setSelectedJobId(j.id)} className={clsx(
                      'rounded-md px-2 py-1 text-[11px] font-medium transition hover:opacity-80',
                      j.status === 'in-progress' ? 'ring-1 ring-white/20' : '',
                    )} style={{ backgroundColor: t.color + '25', color: t.color }}>
                      {j.time} &middot; {j.type.split(' ').slice(0, 2).join(' ')}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedJob && <QuoteBuilder job={selectedJob} onClose={() => setSelectedJobId(null)} />}
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-5">
      <h2 className="text-xl font-bold">Van Inventory</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {vans.map(v => {
          const tech = TECHS.find(t => t.id === v.techId);
          return (
            <div key={v.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold">{v.label}</p>
                  <p className="text-xs text-muted-foreground">{tech?.name}</p>
                </div>
                <button onClick={() => scanBarcode(v.id)} className="flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[10px] font-medium hover:bg-muted transition">
                  <ScanLine size={12} /> Scan Barcode
                </button>
              </div>
              <ul className="space-y-1">
                {v.parts.map(p => (
                  <li key={p.name} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{p.name}</span>
                    <span className="font-mono font-medium">{p.qty}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Transfer */}
      <div className="rounded-xl border border-border bg-card p-4 max-w-lg">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><ArrowRightLeft size={14} /> Transfer Parts</h3>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col text-xs gap-1">
            From
            <select value={transferFrom} onChange={e => { setTransferFrom(Number(e.target.value)); setTransferPart(''); }} className="rounded-lg border border-border bg-muted px-2 py-1.5 text-sm text-foreground">
              {vans.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
            </select>
          </label>
          <label className="flex flex-col text-xs gap-1">
            To
            <select value={transferTo} onChange={e => setTransferTo(Number(e.target.value))} className="rounded-lg border border-border bg-muted px-2 py-1.5 text-sm text-foreground">
              {vans.filter(v => v.id !== transferFrom).map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
            </select>
          </label>
          <label className="flex flex-col text-xs gap-1">
            Part
            <select value={transferPart} onChange={e => setTransferPart(e.target.value)} className="rounded-lg border border-border bg-muted px-2 py-1.5 text-sm text-foreground">
              <option value="">Select part...</option>
              {vans.find(v => v.id === transferFrom)?.parts.map(p => <option key={p.name} value={p.name}>{p.name} ({p.qty})</option>)}
            </select>
          </label>
          <button onClick={transferParts} disabled={!transferPart} className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white disabled:opacity-40 hover:bg-accent/90 transition">
            Transfer
          </button>
        </div>
      </div>
    </div>
  );

  const renderPayroll = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Time &amp; Payroll</h2>
        <select value={selectedTech} onChange={e => setSelectedTech(Number(e.target.value))} className="rounded-lg border border-border bg-muted px-3 py-1.5 text-sm text-foreground">
          {TECHS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {selectedTech === 1 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-2 text-sm">
          <AlertTriangle size={16} className="text-amber-400 shrink-0" />
          <span className="text-amber-200"><b>GPS Anomaly:</b> John Smith clocked in from <b>Nashville, TN</b> on Thu 4/23 — 180 mi from service area.</span>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wide">
              <th className="p-3">Day</th>
              <th className="p-3">Clock In</th>
              <th className="p-3">Clock Out</th>
              <th className="p-3">Hours</th>
              <th className="p-3">Location</th>
              <th className="p-3">Flag</th>
            </tr>
          </thead>
          <tbody>
            {timeclock.map(tc => {
              let hours = '—';
              if (tc.clockOut) {
                const parseT = (s: string) => { const [t, ap] = s.split(' '); const [h, m] = t.split(':').map(Number); return ((h % 12) + (ap === 'PM' ? 12 : 0)) * 60 + m; };
                const diff = parseT(tc.clockOut) - parseT(tc.clockIn);
                hours = (diff / 60).toFixed(1);
              }
              return (
                <tr key={tc.date} className={clsx('border-b border-border last:border-0', tc.anomaly && 'bg-amber-500/5')}>
                  <td className="p-3 font-medium">{tc.date}</td>
                  <td className="p-3 font-mono">{tc.clockIn}</td>
                  <td className="p-3 font-mono">{tc.clockOut ?? <span className="text-green-400">Active</span>}</td>
                  <td className="p-3 font-mono">{hours}</td>
                  <td className="p-3 text-muted-foreground flex items-center gap-1"><MapPin size={12} />{tc.location}</td>
                  <td className="p-3">{tc.anomaly && <Badge color="#f59e0b">GPS !</Badge>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold mb-2">Weekly Summary — {TECHS.find(t => t.id === selectedTech)?.name}</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div><p className="text-2xl font-bold">{selectedTech === 1 ? '42.3' : '40.2'}</p><p className="text-xs text-muted-foreground">Total Hours</p></div>
          <div><p className="text-2xl font-bold">{selectedTech === 1 ? '2.3' : '0.2'}</p><p className="text-xs text-muted-foreground">Overtime</p></div>
          <div><p className="text-2xl font-bold">{selectedTech === 1 ? '6' : '4'}</p><p className="text-xs text-muted-foreground">Jobs Completed</p></div>
          <div><p className="text-2xl font-bold">${(TECH_CHART[selectedTech - 1]?.revenue ?? 4200).toLocaleString()}</p><p className="text-xs text-muted-foreground">Revenue</p></div>
        </div>
      </div>
    </div>
  );

  const renderMembership = () => {
    const overdue = members.filter(m => m.status === 'overdue');
    return (
      <div className="space-y-5">
        <h2 className="text-xl font-bold">Membership Plans</h2>

        {overdue.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm">
            <AlertTriangle size={16} className="text-red-400 shrink-0" />
            <span className="text-red-200"><b>Overdue:</b> {overdue.map(m => m.name).join(', ')} — service past due, contact ASAP.</span>
          </div>
        )}

        <div className="rounded-xl border border-accent bg-accent/10 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Monthly Recurring Revenue</p>
            <p className="text-3xl font-bold text-accent">${mrrTotal.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{members.length} active members</p>
            <p className="text-xs text-muted-foreground">ARR ${(mrrTotal * 12).toLocaleString()}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wide">
                <th className="p-3">Member</th>
                <th className="p-3">Plan</th>
                <th className="p-3">MRR</th>
                <th className="p-3">Next Service</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                  <td className="p-3 font-medium">{m.name}</td>
                  <td className="p-3">
                    <Badge color={m.plan === 'Platinum' ? '#0ea5e9' : m.plan === 'Gold' ? '#f59e0b' : '#94a3b8'}>{m.plan}</Badge>
                  </td>
                  <td className="p-3 font-mono">${m.mrr}</td>
                  <td className="p-3 text-muted-foreground">{m.nextService}</td>
                  <td className="p-3">
                    <Badge color={m.status === 'active' ? '#10b981' : m.status === 'overdue' ? '#ef4444' : '#f59e0b'}>{m.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const content: Record<Tab, () => React.JSX.Element> = {
    dashboard: renderDashboard,
    dispatch: renderDispatch,
    inventory: renderInventory,
    payroll: renderPayroll,
    membership: renderMembership,
  };

  /* ─── LAYOUT ────────────────────────────── */

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Demo banner */}
      <div className="flex items-center justify-between border-b border-amber-500/30 bg-amber-500/10 px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase text-black tracking-wide">Demo Mode</span>
          <span className="text-sm text-amber-200">Smith Plumbing Co. — Knoxville, TN</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={reset} className="flex items-center gap-1 rounded-lg border border-amber-500/40 px-3 py-1 text-xs font-medium text-amber-200 hover:bg-amber-500/20 transition">
            <RotateCcw size={12} /> Reset
          </button>
          <Link href="/plumbing-ops" className="text-xs text-amber-200/70 hover:text-amber-200 transition">Exit Demo</Link>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="w-56 shrink-0 border-r border-border bg-card p-3 hidden md:flex flex-col gap-1">
          <div className="flex items-center gap-2 px-3 py-3 mb-2">
            <Wrench size={18} className="text-accent" />
            <span className="text-sm font-bold text-accent tracking-tight">PlumbControl</span>
          </div>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={clsx(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition text-left',
              tab === t.key ? 'bg-accent/15 text-accent' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </nav>

        {/* Mobile tabs */}
        <div className="md:hidden flex border-b border-border bg-card overflow-x-auto">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={clsx(
              'flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition',
              tab === t.key ? 'border-accent text-accent' : 'border-transparent text-muted-foreground',
            )}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {content[tab]()}
        </main>
      </div>
    </div>
  );
}
