import { Link } from "@tanstack/react-router";
import { Building2 } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-ink text-ink-foreground">
      <div className="page-shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-white">
            <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-gold"><Building2 size={18} /></span>
            Royal Keys
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/65">
            A software-powered Sri Lankan real-estate brokerage. We manage the enquiry, qualification,
            viewing and transaction workflow so owners pay for successful outcomes, not just advertising.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Property</p>
          <div className="mt-3 grid gap-2 text-sm text-white/65">
            <Link to="/buy">Buy property</Link><Link to="/rent">Rent property</Link>
            <Link to="/sell">Sell with Royal Keys</Link><Link to="/list-for-rent">Find a tenant</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Important</p>
          <div className="mt-3 grid gap-2 text-sm text-white/65">
            <Link to="/how-it-works">How it works</Link>
            <span>Agency terms are subject to final signed legal terms.</span>
            <span>Property information is verified progressively; never rely on a listing alone for legal title.</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/45">
        © 2026 Royal Keys. Demo software build — Sri Lanka.
      </div>
    </footer>
  );
}
