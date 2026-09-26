import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { TransactionType } from "@/types/domain";

export interface PropertySearchValues {
  location: string;
  propertyType: string;
  min: string;
  max: string;
  bedrooms: string;
}

export function PropertySearch({
  defaultTransaction = "sale",
  compact = false,
  initial,
}: {
  defaultTransaction?: TransactionType;
  compact?: boolean;
  initial?: Partial<PropertySearchValues>;
}) {
  const [transaction, setTransaction] = useState<TransactionType>(defaultTransaction);
  const [values, setValues] = useState<PropertySearchValues>({
    location: initial?.location ?? "",
    propertyType: initial?.propertyType ?? "",
    min: initial?.min ?? "",
    max: initial?.max ?? "",
    bedrooms: initial?.bedrooms ?? "",
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    window.location.assign(`/${transaction === "sale" ? "buy" : "rent"}?${params.toString()}`);
  }

  return (
    <div className={compact ? "card-surface p-3" : "card-surface p-4 shadow-lift"}>
      <div className="mb-3 flex gap-1 rounded-lg bg-surface p-1">
        <button
          type="button"
          onClick={() => setTransaction("sale")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-bold transition ${transaction === "sale" ? "bg-card text-ink shadow-sm" : "text-muted-foreground"}`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setTransaction("rent")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-bold transition ${transaction === "rent" ? "bg-card text-ink shadow-sm" : "text-muted-foreground"}`}
        >
          Rent
        </button>
      </div>
      <form onSubmit={submit} className={`grid gap-2 ${compact ? "md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]" : "md:grid-cols-2 lg:grid-cols-[1.5fr_1.05fr_.85fr_.85fr_.75fr_auto]"}`}>
        <input
          className="field"
          placeholder="Location e.g. Colombo 05"
          value={values.location}
          onChange={(event) => setValues((previous) => ({ ...previous, location: event.target.value }))}
        />
        <select className="field" value={values.propertyType} onChange={(event) => setValues((previous) => ({ ...previous, propertyType: event.target.value }))}>
          <option value="">Any property</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="land">Land</option>
          <option value="commercial">Commercial</option>
          <option value="villa">Villa</option>
        </select>
        <input className="field" inputMode="numeric" placeholder="Min LKR" value={values.min} onChange={(event) => setValues((previous) => ({ ...previous, min: event.target.value.replace(/\D/g, "") }))} />
        <input className="field" inputMode="numeric" placeholder="Max LKR" value={values.max} onChange={(event) => setValues((previous) => ({ ...previous, max: event.target.value.replace(/\D/g, "") }))} />
        {!compact ? (
          <select className="field" value={values.bedrooms} onChange={(event) => setValues((previous) => ({ ...previous, bedrooms: event.target.value }))}>
            <option value="">Beds</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option>
          </select>
        ) : null}
        <button className="btn-primary px-5" type="submit"><Search size={17} /> Search</button>
      </form>
    </div>
  );
}
