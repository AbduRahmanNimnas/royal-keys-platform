import { Link } from "@tanstack/react-router";
import {
  BadgeDollarSign,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  HandCoins,
  Home,
  LayoutDashboard,
  Link2,
  ListChecks,
  LogOut,
  RefreshCw,
  Settings,
  Sparkles,
  UsersRound,
} from "lucide-react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { useRoyalKeysStore } from "@/lib/store";

export type AdminSection =
  | "overview"
  | "properties"
  | "owners"
  | "leads"
  | "matches"
  | "introductions"
  | "viewings"
  | "offers"
  | "applications"
  | "deals"
  | "commissions"
  | "tasks"
  | "settings";

export const adminNav: Array<{ id: AdminSection; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "properties", label: "Properties", icon: Building2 },
  { id: "owners", label: "Owners", icon: UsersRound },
  { id: "leads", label: "Buyers & Tenants", icon: UsersRound },
  { id: "matches", label: "Match Center", icon: Sparkles },
  { id: "introductions", label: "Introductions", icon: Link2 },
  { id: "viewings", label: "Viewings", icon: CalendarDays },
  { id: "offers", label: "Offers", icon: HandCoins },
  { id: "applications", label: "Rental Applications", icon: ClipboardCheck },
  { id: "deals", label: "Deals", icon: CheckCircle2 },
  { id: "commissions", label: "Commissions", icon: BadgeDollarSign },
  { id: "tasks", label: "Tasks / Follow-ups", icon: ListChecks },
  { id: "settings", label: "Settings", icon: Settings },
];

export function AdminFrame({
  section,
  setSection,
  mobileMenu,
  setMobileMenu,
  children,
}: {
  section: AdminSection;
  setSection: Dispatch<SetStateAction<AdminSection>>;
  mobileMenu: boolean;
  setMobileMenu: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}) {
  const { resetDemo } = useRoyalKeysStore();
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <button type="button" onClick={() => setMobileMenu((v) => !v)} className="grid size-10 place-items-center rounded-lg border border-border"><ListChecks size={18} /></button>
        <Link to="/" className="flex items-center gap-2 font-black text-ink"><Building2 size={18} /> Royal Keys</Link>
        <span className="rounded-full bg-success/10 px-2 py-1 text-[10px] font-black uppercase text-success">{isSupabaseConfigured ? "Live auth" : "Demo"}</span>
      </header>

      <div className="flex min-h-screen">
        <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-ink text-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${mobileMenu ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 p-5">
              <Link to="/" className="flex items-center gap-3 font-black">
                <span className="grid size-10 place-items-center rounded-xl bg-white/10 text-gold"><Building2 size={19} /></span>
                <span><span className="block text-lg">Royal Keys</span><span className="block text-[10px] font-bold uppercase tracking-[.16em] text-white/45">Brokerage OS</span></span>
              </Link>
            </div>
            <nav className="flex-1 overflow-auto p-3">
              <div className="grid gap-1">
                {adminNav.map((item) => (
                  <button key={item.id} type="button" onClick={() => { setSection(item.id); setMobileMenu(false); }} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${section === item.id ? "bg-white/10 text-white" : "text-white/58 hover:bg-white/[.06] hover:text-white"}`}>
                    <item.icon size={17} className={section === item.id ? "text-gold" : ""} />{item.label}
                  </button>
                ))}
              </div>
            </nav>
            <div className="border-t border-white/10 p-4">
              <div className="rounded-xl bg-white/[.06] p-3 text-xs leading-5 text-white/55">
                <p className="font-bold text-white">Mode</p>
                <p>{isSupabaseConfigured ? "Supabase credentials detected." : "Browser-persistent demo data."}</p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link to="/" className="flex items-center justify-center gap-1 rounded-lg border border-white/10 px-2 py-2 text-xs font-bold text-white/70"><Home size={14} /> Website</Link>
                {isSupabaseConfigured ? (
                  <button type="button" onClick={() => void supabase?.auth.signOut()} className="flex items-center justify-center gap-1 rounded-lg border border-white/10 px-2 py-2 text-xs font-bold text-white/70"><LogOut size={14} /> Sign out</button>
                ) : (
                  <button type="button" onClick={resetDemo} className="flex items-center justify-center gap-1 rounded-lg border border-white/10 px-2 py-2 text-xs font-bold text-white/70"><RefreshCw size={14} /> Reset</button>
                )}
              </div>
            </div>
          </div>
        </aside>

        {mobileMenu ? <button type="button" aria-label="Close menu" className="fixed inset-0 z-30 bg-ink/55 lg:hidden" onClick={() => setMobileMenu(false)} /> : null}

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div><p className="text-xs font-black uppercase tracking-[.15em] text-muted-foreground">Royal Keys operations</p><h1 className="mt-1 text-3xl font-black text-ink sm:text-4xl">{adminNav.find((item) => item.id === section)?.label}</h1></div>
              <div className="flex gap-2"><Link to="/sell" className="btn-outline text-sm">Add sale</Link><Link to="/list-for-rent" className="btn-primary text-sm">Add rental</Link></div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function AdminTable({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="card-surface overflow-hidden">
      <div className="border-b border-border p-5"><h2 className="text-xl font-bold">{title}</h2>{description ? <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">{description}</p> : null}</div>
      <div className="overflow-x-auto">
        <div className="[&_table]:w-full [&_table]:min-w-[850px] [&_th]:bg-surface/80 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:text-[11px] [&_th]:font-black [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-muted-foreground [&_td]:border-t [&_td]:border-border [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_td]:text-sm">
          {children}
        </div>
      </div>
    </section>
  );
}

export function StatusPill({ value }: { value: string }) {
  const positive = ["paid", "won", "verified", "accepted", "completed", "confirmed"].includes(value);
  const alert = ["lost", "declined", "cancelled", "no_show"].includes(value);
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black capitalize ${positive ? "bg-success/10 text-success" : alert ? "bg-destructive/10 text-destructive" : "bg-surface text-muted-foreground"}`}>{value.replace("_", " ")}</span>;
}
