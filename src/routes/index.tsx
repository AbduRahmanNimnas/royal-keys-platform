import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, CalendarCheck2, Handshake, ShieldCheck, Sparkles, TrendingUp, UsersRound } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertySearch } from "@/components/PropertySearch";
import { PublicLayout } from "@/components/PublicLayout";
import { useRoyalKeysStore } from "@/lib/store";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const { state } = useRoyalKeysStore();
  const featured = state.properties.filter((property) => property.featured && ["live", "under_offer"].includes(property.status)).slice(0, 3);
  return (
    <PublicLayout>
      <section className="hero-grid overflow-hidden border-b border-border">
        <div className="page-shell grid min-h-[620px] items-center gap-10 py-16 lg:grid-cols-[1.1fr_.9fr] lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-muted-foreground shadow-sm"><Sparkles size={14} className="text-gold-foreground" /> Software-powered real estate brokerage</div>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[.98] text-ink sm:text-6xl lg:text-7xl">Stop chasing listings. <span className="text-primary">Move the deal forward.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Buy, rent, sell or find a tenant through one managed workflow — qualification, viewing, offers and deal tracking included.</p>
            <div className="mt-8"><PropertySearch /></div>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground"><span className="flex items-center gap-1.5"><BadgeCheck size={14} className="text-success" /> Managed enquiries</span><span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-success" /> Owner contact kept private</span><span className="flex items-center gap-1.5"><CalendarCheck2 size={14} className="text-success" /> Viewing workflow</span></div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="overflow-hidden rounded-[2rem] border border-white/15 bg-ink p-2 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1500&q=88" alt="Premium residential interior" className="aspect-[4/5] w-full rounded-[1.55rem] object-cover" />
            </div>
            <div className="absolute -bottom-5 -left-3 max-w-[250px] rounded-2xl border border-border bg-card p-4 shadow-lift sm:-left-8">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Owner model</p><p className="mt-1 text-lg font-black text-ink">3% only when sold</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Core sale brokerage success fee. Final terms subject to signed agreement.</p>
            </div>
            <div className="absolute -right-2 top-8 rounded-2xl bg-gold p-4 text-gold-foreground shadow-lift sm:-right-8"><p className="text-xs font-bold uppercase tracking-wider opacity-70">Rental placement</p><p className="mt-1 text-lg font-black">½ month rent</p></div>
          </div>
        </div>
      </section>

      <section className="page-shell py-16">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Live opportunities</p><h2 className="mt-2 text-4xl font-black text-ink">Featured properties</h2></div><div className="flex gap-2"><Link to="/buy" className="btn-outline text-sm">View sales</Link><Link to="/rent" className="btn-outline text-sm">View rentals</Link></div></div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{featured.map((property) => <PropertyCard key={property.id} property={property} />)}</div>
      </section>

      <section className="bg-ink py-16 text-white">
        <div className="page-shell">
          <div className="max-w-3xl"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-gold">For property owners</p><h2 className="mt-3 text-4xl font-black sm:text-5xl">Don't pay for an ad and hope. Use a transaction workflow.</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-white/65">Royal Keys is designed around successful outcomes: qualified demand, managed viewings, offers and trackable introductions.</p></div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Link to="/sell" className="group rounded-2xl border border-white/12 bg-white/[.06] p-6 transition hover:bg-white/[.1]"><div className="flex items-start justify-between gap-6"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-gold">Sell</p><h3 className="mt-2 text-3xl font-black">3% only when sold</h3><p className="mt-3 max-w-lg text-sm leading-6 text-white/60">Submit the property, accept the agency terms, track demand and move qualified buyers through the pipeline.</p></div><ArrowRight className="mt-2 transition group-hover:translate-x-1" /></div></Link>
            <Link to="/list-for-rent" className="group rounded-2xl border border-white/12 bg-white/[.06] p-6 transition hover:bg-white/[.1]"><div className="flex items-start justify-between gap-6"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-gold">Let</p><h3 className="mt-2 text-3xl font-black">½ month rent on success</h3><p className="mt-3 max-w-lg text-sm leading-6 text-white/60">Capture tenants, qualify fit, schedule viewings and record rental applications without publishing the owner's number.</p></div><ArrowRight className="mt-2 transition group-hover:translate-x-1" /></div></Link>
          </div>
        </div>
      </section>

      <section className="page-shell py-16">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div><p className="eyebrow">Built for a lean brokerage</p><h2 className="mt-2 text-4xl font-black text-ink">One operator. A system behind every deal.</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">The software prioritizes the parts that normally consume agent time: qualification, matching, viewing coordination, offer tracking, rental applications and commission control.</p><Link to="/how-it-works" className="btn-primary mt-6">See the workflow <ArrowRight size={16} /></Link></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[{ icon: UsersRound, title: "Qualified demand", copy: "Lead scoring highlights who is ready to move, not just who clicked an ad." },{ icon: TrendingUp, title: "Automatic matching", copy: "Area, budget, transaction type, property type and bedrooms generate match scores." },{ icon: CalendarCheck2, title: "Viewing control", copy: "Viewing requests remain connected to the property, lead and activity timeline." },{ icon: Handshake, title: "Commission visibility", copy: "3% sale and half-month rental fees are calculated from the final successful amount." }].map((item) => <div key={item.title} className="card-surface p-5"><span className="grid size-10 place-items-center rounded-xl bg-surface text-primary"><item.icon size={18} /></span><h3 className="mt-4 text-xl font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.copy}</p></div>)}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
