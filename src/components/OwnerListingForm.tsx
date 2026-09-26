import { CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { compactLkr } from "@/lib/business";
import { useRoyalKeysStore } from "@/lib/store";
import type { PropertyType, TransactionType } from "@/types/domain";

export function OwnerListingForm({ transactionType }: { transactionType: TransactionType }) {
  const { addOwnerProperty } = useRoyalKeysStore();
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    ownerName: "",
    ownerMobile: "",
    ownerEmail: "",
    propertyType: "apartment" as PropertyType,
    title: "",
    city: "",
    district: "Colombo",
    price: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
    availableFrom: "",
    authorizationConfirmed: false,
    termsAccepted: false,
  });

  const amount = Number(form.price || 0);
  const exampleFee = transactionType === "sale" ? amount * 0.03 : amount * 0.5;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.authorizationConfirmed || !form.termsAccepted || amount <= 0) return;
    const property = addOwnerProperty({
      transactionType,
      ownerName: form.ownerName.trim(),
      ownerMobile: form.ownerMobile.trim(),
      ownerEmail: form.ownerEmail.trim(),
      propertyType: form.propertyType,
      title: form.title.trim(),
      city: form.city.trim(),
      district: form.district.trim(),
      price: amount,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      description: form.description.trim(),
      availableFrom: form.availableFrom || new Date().toISOString().slice(0, 10),
      authorizationConfirmed: form.authorizationConfirmed,
    });
    setSubmittedId(property.id);
  }

  if (submittedId) {
    return (
      <div className="card-surface p-8 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/10 text-success"><CheckCircle2 size={28} /></span>
        <h2 className="mt-4 text-2xl font-bold">Property submitted for review</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Reference <strong>{submittedId}</strong>. It is currently marked Pending Review. Royal Keys should verify the owner/authorization and property information before making it public.
        </p>
        <button type="button" className="btn-outline mt-5" onClick={() => setSubmittedId(null)}>Submit another property</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.5fr_.85fr]">
      <div className="card-surface p-5 sm:p-7">
        <div className="flex items-center gap-2 text-sm font-bold text-primary"><ShieldCheck size={17} /> Owner & property details</div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">Owner name<input className="field mt-1.5" required value={form.ownerName} onChange={(e) => setForm((p) => ({ ...p, ownerName: e.target.value }))} /></label>
          <label className="text-sm font-semibold">Mobile<input className="field mt-1.5" required placeholder="+94 77 ..." value={form.ownerMobile} onChange={(e) => setForm((p) => ({ ...p, ownerMobile: e.target.value }))} /></label>
          <label className="text-sm font-semibold sm:col-span-2">Email<input className="field mt-1.5" type="email" required value={form.ownerEmail} onChange={(e) => setForm((p) => ({ ...p, ownerEmail: e.target.value }))} /></label>
        </div>

        <div className="my-6 border-t border-border" />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">Property type
            <select className="field mt-1.5" value={form.propertyType} onChange={(e) => setForm((p) => ({ ...p, propertyType: e.target.value as PropertyType }))}>
              <option value="apartment">Apartment</option><option value="house">House</option><option value="land">Land</option><option value="commercial">Commercial</option><option value="villa">Villa</option>
            </select>
          </label>
          <label className="text-sm font-semibold">{transactionType === "sale" ? "Expected selling price" : "Monthly rent"}
            <input className="field mt-1.5" required inputMode="numeric" placeholder="LKR" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value.replace(/\D/g, "") }))} />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">Listing title<input className="field mt-1.5" required placeholder="e.g. Modern 3BR apartment in Colombo 05" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} /></label>
          <label className="text-sm font-semibold">City / area<input className="field mt-1.5" required placeholder="Colombo 05" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} /></label>
          <label className="text-sm font-semibold">District<input className="field mt-1.5" required value={form.district} onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))} /></label>
          <label className="text-sm font-semibold">Bedrooms<input className="field mt-1.5" type="number" min="0" value={form.bedrooms} onChange={(e) => setForm((p) => ({ ...p, bedrooms: e.target.value }))} /></label>
          <label className="text-sm font-semibold">Bathrooms<input className="field mt-1.5" type="number" min="0" value={form.bathrooms} onChange={(e) => setForm((p) => ({ ...p, bathrooms: e.target.value }))} /></label>
          <label className="text-sm font-semibold sm:col-span-2">Available from<input className="field mt-1.5" type="date" value={form.availableFrom} onChange={(e) => setForm((p) => ({ ...p, availableFrom: e.target.value }))} /></label>
          <label className="text-sm font-semibold sm:col-span-2">Property description<textarea className="field mt-1.5 min-h-32 resize-y" required placeholder="Key features, condition, access, parking, etc." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></label>
        </div>

        <div className="mt-5 grid gap-3 rounded-xl bg-surface p-4 text-sm">
          <label className="flex gap-3"><input className="mt-1" type="checkbox" checked={form.authorizationConfirmed} onChange={(e) => setForm((p) => ({ ...p, authorizationConfirmed: e.target.checked }))} /><span>I confirm I am the owner or am authorized by the owner to submit this property for brokerage review.</span></label>
          <label className="flex gap-3"><input className="mt-1" type="checkbox" checked={form.termsAccepted} onChange={(e) => setForm((p) => ({ ...p, termsAccepted: e.target.checked }))} /><span>I acknowledge the success-fee model below. Final commission entitlement, introduction protection, payment timing and agency rights remain subject to the signed Royal Keys agency terms.</span></label>
        </div>
        <button className="btn-primary mt-5 w-full sm:w-auto" disabled={!form.authorizationConfirmed || !form.termsAccepted}>Submit for brokerage review</button>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl bg-ink p-6 text-white shadow-lift">
          <p className="text-xs font-extrabold uppercase tracking-[.14em] text-gold">Success fee</p>
          <p className="mt-3 text-3xl font-black">{transactionType === "sale" ? "3%" : "½ month"}</p>
          <p className="mt-2 text-sm leading-6 text-white/70">
            {transactionType === "sale" ? "3% of the final successful transaction price." : "50% of one month's agreed rent when Royal Keys successfully places the tenant."}
          </p>
          {amount > 0 ? <div className="mt-5 rounded-xl bg-white/8 p-4"><p className="text-xs text-white/55">Illustrative fee at your entered amount</p><p className="mt-1 text-xl font-extrabold text-gold">{compactLkr(exampleFee)}</p></div> : null}
          <p className="mt-4 text-xs leading-5 text-white/45">No success fee is calculated merely for submitting a property. Final legal terms must be signed before brokerage engagement.</p>
        </div>
        <div className="card-surface p-5">
          <div className="flex gap-3"><LockKeyhole className="mt-0.5 shrink-0 text-primary" size={19} /><div><p className="text-sm font-bold">Owner privacy</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Public listings do not expose the owner's phone number. Enquiries are qualified and tracked inside Royal Keys.</p></div></div>
        </div>
      </aside>
    </form>
  );
}
