import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, CalendarDays, FileCheck2, HandCoins, Megaphone, SearchCheck, ShieldCheck, UsersRound } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";

export const Route = createFileRoute("/how-it-works")({ component: HowItWorksPage });

function HowItWorksPage() {
  const steps = [
    { icon: FileCheck2, title: "Owner submits", copy: "Sale or rental property enters Pending Review with owner/authorization confirmation and the agreed success-fee model." },
    { icon: ShieldCheck, title: "Royal Keys reviews", copy: "The brokerage checks the listing information, readiness and engagement terms before public marketing." },
    { icon: Megaphone, title: "Demand is generated", copy: "Website, paid media and distribution channels send enquiries into one tracked CRM instead of directly to the owner." },
    { icon: UsersRound, title: "Leads are qualified", copy: "Budget, area, timeline, funding or move-in readiness creates an operational lead score." },
    { icon: SearchCheck, title: "Matches are ranked", copy: "Properties and demand are matched using transaction type, area, property type, budget and bedrooms." },
    { icon: CalendarDays, title: "Viewings are controlled", copy: "Each viewing is tied to a lead and property so introductions and follow-up remain traceable." },
    { icon: HandCoins, title: "Offers / applications", copy: "Buyers submit offers; tenants submit applications. The broker sees the negotiation pipeline instead of scattered chats." },
    { icon: BadgeCheck, title: "Close & commission", copy: "Successful sales calculate 3%; successful rental placements calculate 50% of one month's agreed rent." },
  ];
  return <PublicLayout><section className="bg-ink py-16 text-white"><div className="page-shell"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-gold">The operating model</p><h1 className="mt-3 max-w-4xl text-5xl font-black sm:text-6xl">A brokerage workflow, not another classifieds page.</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-white/65">Royal Keys is designed to preserve attribution from first enquiry through viewing, negotiation and close — while automating repetitive agent work.</p></div></section><section className="page-shell py-14"><div className="grid gap-4 md:grid-cols-2">{steps.map((step, index) => <div key={step.title} className="card-surface p-6"><div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ink text-gold"><step.icon size={19} /></span><div><p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Step {index + 1}</p><h2 className="mt-1 text-2xl font-bold">{step.title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{step.copy}</p></div></div></div>)}</div><div className="mt-10 rounded-2xl bg-gold/15 p-6 sm:flex sm:items-center sm:justify-between"><div><h2 className="text-2xl font-bold">Ready to test the model?</h2><p className="mt-1 text-sm text-muted-foreground">Submit a property or open the brokerage dashboard to see the transaction pipeline.</p></div><div className="mt-4 flex gap-2 sm:mt-0"><Link to="/sell" className="btn-primary">List property <ArrowRight size={16} /></Link><Link to="/admin" className="btn-outline">Dashboard</Link></div></div></section></PublicLayout>;
}
