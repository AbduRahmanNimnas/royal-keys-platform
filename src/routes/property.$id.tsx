import { createFileRoute, Link } from "@tanstack/react-router";
import { Bath, BedDouble, CalendarClock, ChevronLeft, MapPin, Maximize2, ShieldCheck } from "lucide-react";
import { PropertyActionPanel } from "@/components/PropertyActionPanel";
import { PropertyCard } from "@/components/PropertyCard";
import { PublicLayout } from "@/components/PublicLayout";
import { compactLkr } from "@/lib/business";
import { useRoyalKeysStore } from "@/lib/store";

export const Route = createFileRoute("/property/$id")({ component: PropertyDetailPage });

function PropertyDetailPage() {
  const { id } = Route.useParams();
  const { state } = useRoyalKeysStore();
  const property = state.properties.find((item) => item.id === id);
  if (!property) {
    return <PublicLayout><div className="page-shell py-20 text-center"><h1 className="text-4xl font-black">Property not found</h1><p className="mt-3 text-sm text-muted-foreground">This property may have been removed or archived.</p><Link to="/" className="btn-primary mt-6">Return home</Link></div></PublicLayout>;
  }

  const related = state.properties.filter((item) => item.id !== property.id && item.transactionType === property.transactionType && ["live", "under_offer"].includes(item.status)).slice(0, 3);

  return (
    <PublicLayout>
      <section className="page-shell py-6 sm:py-8">
        <Link to={property.transactionType === "sale" ? "/buy" : "/rent"} className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground"><ChevronLeft size={16} /> Back to {property.transactionType === "sale" ? "sales" : "rentals"}</Link>
        <div className="mt-5 grid gap-3 lg:grid-cols-[1.5fr_.7fr]">
          <div className="overflow-hidden rounded-2xl bg-surface"><img src={property.images[0]} alt={property.title} className="aspect-[16/10] h-full w-full object-cover" /></div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {(property.images.slice(1, 3).length ? property.images.slice(1, 3) : [property.images[0], property.images[0]]).map((image, index) => <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl bg-surface"><img src={image} alt={`${property.title} view ${index + 2}`} className="aspect-[16/10] h-full w-full object-cover" /></div>)}
          </div>
        </div>
      </section>

      <section className="page-shell grid gap-8 pb-12 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-ink px-3 py-1 text-xs font-bold uppercase text-white">{property.transactionType === "sale" ? "For sale" : "For rent"}</span><span className="rounded-full bg-surface px-3 py-1 text-xs font-bold capitalize">{property.status.replace("_", " ")}</span><span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">Managed listing</span></div>
          <h1 className="mt-4 text-4xl font-black text-ink sm:text-5xl">{property.title}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin size={15} /> {property.city}, {property.district} · {property.addressHint}</p>
          <p className="mt-5 text-3xl font-black text-ink">{compactLkr(property.price)}{property.transactionType === "rent" ? <span className="text-sm font-semibold text-muted-foreground"> / month</span> : null}</p>

          <div className="mt-6 flex flex-wrap gap-3 rounded-2xl border border-border bg-card p-4 text-sm font-semibold text-muted-foreground">
            {property.bedrooms != null ? <span className="flex items-center gap-1.5"><BedDouble size={17} className="text-primary" /> {property.bedrooms} bedrooms</span> : null}
            {property.bathrooms != null ? <span className="flex items-center gap-1.5"><Bath size={17} className="text-primary" /> {property.bathrooms} bathrooms</span> : null}
            {property.areaSqft != null ? <span className="flex items-center gap-1.5"><Maximize2 size={17} className="text-primary" /> {property.areaSqft.toLocaleString()} sqft</span> : null}
            {property.landPerches != null ? <span>{property.landPerches} perches</span> : null}
            <span className="flex items-center gap-1.5"><CalendarClock size={17} className="text-primary" /> Available {new Date(property.availableFrom).toLocaleDateString("en-LK")}</span>
          </div>

          <div className="mt-8"><h2 className="text-2xl font-bold">About this property</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{property.description}</p></div>
          <div className="mt-8"><h2 className="text-2xl font-bold">Features</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{property.amenities.map((amenity) => <div key={amenity} className="flex items-center gap-2 rounded-xl bg-surface px-4 py-3 text-sm font-semibold"><ShieldCheck size={16} className="text-success" /> {amenity}</div>)}</div></div>
          <div className="mt-8 rounded-2xl border border-border bg-surface p-5"><p className="text-sm font-bold">Verification note</p><p className="mt-2 text-xs leading-5 text-muted-foreground">A managed listing means Royal Keys tracks the owner submission and enquiry workflow. It is not a legal title opinion. Buyers and tenants should complete appropriate document, legal, valuation and physical checks before entering a binding transaction.</p></div>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start"><PropertyActionPanel property={property} /></aside>
      </section>

      {related.length ? <section className="border-t border-border bg-surface/50 py-12"><div className="page-shell"><h2 className="text-3xl font-black">Similar opportunities</h2><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <PropertyCard key={item.id} property={item} />)}</div></div></section> : null}
    </PublicLayout>
  );
}
