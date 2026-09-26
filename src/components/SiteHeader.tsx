import { Link } from "@tanstack/react-router";
import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";

const nav = [
  { label: "Buy", to: "/buy" },
  { label: "Rent", to: "/rent" },
  { label: "Sell", to: "/sell" },
  { label: "List for Rent", to: "/list-for-rent" },
  { label: "How it works", to: "/how-it-works" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/94 backdrop-blur-xl">
      <div className="page-shell flex h-18 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-ink">
          <span className="grid size-9 place-items-center rounded-xl bg-ink text-gold">
            <Building2 size={18} strokeWidth={2.4} />
          </span>
          <span className="text-lg">Royal Keys</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-surface hover:text-foreground"
              activeProps={{ className: "bg-surface text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/admin" className="btn-outline text-sm">Broker Dashboard</Link>
          <Link to="/sell" className="btn-primary text-sm">List a property</Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
          className="grid size-10 place-items-center rounded-lg border border-border bg-card lg:hidden"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="page-shell grid gap-1 py-4">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-semibold hover:bg-surface"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-4">
              <Link to="/admin" onClick={() => setOpen(false)} className="btn-outline text-sm">Dashboard</Link>
              <Link to="/sell" onClick={() => setOpen(false)} className="btn-primary text-sm">List property</Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
