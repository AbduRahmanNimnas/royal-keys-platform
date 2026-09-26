import { SlidersHorizontal } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertySearch, type PropertySearchValues } from "@/components/PropertySearch";
import { PublicLayout } from "@/components/PublicLayout";
import { useRoyalKeysStore } from "@/lib/store";
import type { PropertyType, TransactionType } from "@/types/domain";

export interface ListingSearch {
  location: string;
  propertyType: string;
  min: string;
  max: string;
  bedrooms: string;
}

export function ListingPage({ transactionType, search }: { transactionType: TransactionType; search: ListingSearch }) {
  const { state } = useRoyalKeysStore();
  const filtered = state.properties.filter((property) => {
    if (property.transactionType !== transactionType) return false;
    if (!["live", "under_offer"].includes(property.status)) return false;
    if (search.location && !`${property.city} ${property.district}`.toLowerCase().includes(search.location.toLowerCase())) return false;
    if (search.propertyType && property.propertyType !== (search.propertyType as PropertyType)) return false;
    if (search.min && property.price < Number(search.min)) return false;
    if (search.max && property.price > Number(search.max)) return false;
    if (search.bedrooms && (property.bedrooms == null || property.bedrooms < Number(search.bedrooms))) return false;
    return true;
  });

  const initial: Partial<PropertySearchValues> = {
    location: search.location,
    propertyType: search.propertyType,
    min: search.min,
    max: search.max,
    bedrooms: search.bedrooms,
  };

  return (
    <PublicLayout>
      <section className="border-b border-border bg-surface/60 py-10">
        <div className="page-shell">
          <p className="eyebrow">Royal Keys marketplace</p>
          <h1 className="mt-2 text-4xl font-black text-ink sm:text-5xl">{transactionType === "sale" ? "Property for sale" : "Property for rent"}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Browse managed listings, then enquire, schedule a viewing, make an offer or apply without exposing owner contact details.</p>
          <div className="mt-6"><PropertySearch defaultTransaction={transactionType} compact initial={initial} /></div>
        </div>
      </section>
      <section className="page-shell py-8 sm:py-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div><p className="text-sm font-bold text-muted-foreground">{filtered.length} result{filtered.length === 1 ? "" : "s"}</p><h2 className="mt-1 text-2xl font-bold">Matching properties</h2></div>
          <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground sm:flex"><SlidersHorizontal size={14} /> Filtered by your search</div>
        </div>
        {filtered.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <div className="card-surface p-10 text-center"><h3 className="text-2xl font-bold">No exact matches yet</h3><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Try widening the area or budget. The qualified-demand workflow can also capture your requirement so Royal Keys can match future listings.</p></div>}
      </section>
    </PublicLayout>
  );
}
