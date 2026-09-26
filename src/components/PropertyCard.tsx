import { Link } from "@tanstack/react-router";
import { Bath, BedDouble, Building2, Heart, MapPin, Maximize2 } from "lucide-react";
import { compactLkr } from "@/lib/business";
import type { Property } from "@/types/domain";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="card-surface rise overflow-hidden">
      <Link to="/property/$id" params={{ id: property.id }} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          <img src={property.images[0]} alt={property.title} className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]" />
          <div className="absolute left-3 top-3 flex gap-2">
            <span className="rounded-full bg-ink/92 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              {property.transactionType === "sale" ? "For sale" : "For rent"}
            </span>
            {property.featured ? <span className="rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-gold-foreground">Featured</span> : null}
          </div>
          <button type="button" aria-label="Save property" className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/92 text-foreground shadow-sm">
            <Heart size={17} />
          </button>
        </div>
      </Link>
      <div className="p-4.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-black tracking-tight text-ink">
              {compactLkr(property.price)}{property.transactionType === "rent" ? <span className="text-xs font-semibold text-muted-foreground"> / month</span> : null}
            </p>
            <h3 className="mt-1 text-lg font-semibold leading-snug">{property.title}</h3>
          </div>
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface text-primary"><Building2 size={17} /></span>
        </div>
        <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground"><MapPin size={14} />{property.city}, {property.district}</p>
        <div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-3 text-xs font-semibold text-muted-foreground">
          {property.bedrooms != null ? <span className="flex items-center gap-1"><BedDouble size={14} />{property.bedrooms} beds</span> : null}
          {property.bathrooms != null ? <span className="flex items-center gap-1"><Bath size={14} />{property.bathrooms} baths</span> : null}
          {property.areaSqft != null ? <span className="flex items-center gap-1"><Maximize2 size={14} />{property.areaSqft.toLocaleString()} sqft</span> : null}
          {property.landPerches != null ? <span>{property.landPerches} perches</span> : null}
        </div>
      </div>
    </article>
  );
}
