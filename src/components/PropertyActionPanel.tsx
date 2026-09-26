import { CalendarDays, CheckCircle2, FileText, HandCoins, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { compactLkr } from "@/lib/business";
import { useRoyalKeysStore } from "@/lib/store";
import type { Property, PropertyType } from "@/types/domain";

type Action = "interest" | "viewing" | "offer" | "apply" | null;

export function PropertyActionPanel({ property }: { property: Property }) {
  const store = useRoyalKeysStore();
  const [action, setAction] = useState<Action>(null);
  const [done, setDone] = useState("");
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    budgetMin: String(Math.max(0, Math.round(property.price * 0.8))),
    budgetMax: String(Math.round(property.price * 1.1)),
    timeline: "30_days",
    fundingMethod: property.transactionType === "sale" ? "cash" : "not_applicable",
    viewingReady: true,
    viewingDate: "",
    viewingTime: "10:00",
    offerAmount: String(Math.round(property.price * 0.95)),
    completionDays: "30",
    moveInDate: property.availableFrom,
    leaseMonths: "12",
    occupants: "2",
    occupation: "",
    pets: false,
    notes: "",
  });

  const heading = useMemo(() => {
    if (action === "viewing") return "Schedule a viewing";
    if (action === "offer") return "Make an offer";
    if (action === "apply") return "Rental application";
    return "I'm interested";
  }, [action]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const lead = store.addLead({
      transactionType: property.transactionType,
      name: form.name,
      mobile: form.mobile,
      email: form.email,
      budgetMin: Number(form.budgetMin || 0),
      budgetMax: Number(form.budgetMax || property.price),
      preferredCities: [property.city],
      propertyTypes: [property.propertyType as PropertyType],
      bedrooms: property.bedrooms,
      timeline: form.timeline as "immediate" | "30_days" | "90_days" | "researching",
      fundingMethod: form.fundingMethod as "cash" | "bank_loan" | "mixed" | "not_applicable",
      moveInDate: property.transactionType === "rent" ? form.moveInDate || null : null,
      leaseMonths: property.transactionType === "rent" ? Number(form.leaseMonths || 12) : null,
      viewingReady: action === "viewing" || form.viewingReady,
      propertyPrice: property.price,
      source: "Property detail page",
      notes: form.notes,
    });

    store.recordIntroduction(
      property.id,
      lead.id,
      action === "viewing" ? "viewing" : action === "offer" ? "offer" : action === "apply" ? "application" : "interest",
    );

    if (action === "viewing") {
      const date = form.viewingDate || new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
      store.scheduleViewing({
        propertyId: property.id,
        leadId: lead.id,
        startsAt: `${date}T${form.viewingTime}:00+05:30`,
        notes: form.notes,
      });
      setDone("Viewing request received. Royal Keys will confirm the slot after coordinating access.");
    } else if (action === "offer") {
      store.addOffer({
        propertyId: property.id,
        leadId: lead.id,
        amount: Number(form.offerAmount),
        fundingMethod: form.fundingMethod as "cash" | "bank_loan" | "mixed",
        completionDays: Number(form.completionDays),
        notes: form.notes,
      });
      setDone("Your offer has been recorded for the Royal Keys negotiation workflow.");
    } else if (action === "apply") {
      store.addRentalApplication({
        propertyId: property.id,
        leadId: lead.id,
        proposedMoveInDate: form.moveInDate,
        leaseMonths: Number(form.leaseMonths),
        occupants: Number(form.occupants),
        occupation: form.occupation,
        pets: form.pets,
        notes: form.notes,
      });
      setDone("Rental application submitted. Royal Keys will review and coordinate next steps.");
    } else {
      setDone("Interest recorded. This enquiry is now in the Royal Keys qualification pipeline.");
    }
  }

  return (
    <>
      <div className="card-surface p-5">
        <p className="text-xs font-extrabold uppercase tracking-[.14em] text-muted-foreground">Managed by Royal Keys</p>
        <p className="mt-2 text-2xl font-black text-ink">{compactLkr(property.price)}{property.transactionType === "rent" ? <span className="text-sm font-semibold text-muted-foreground"> / month</span> : null}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Owner contact details are kept private. Royal Keys coordinates enquiries, verification and viewings.</p>
        <div className="mt-5 grid gap-2">
          <button type="button" className="btn-primary w-full" onClick={() => { setDone(""); setAction("viewing"); }}><CalendarDays size={17} /> Schedule viewing</button>
          <button type="button" className="btn-outline w-full" onClick={() => { setDone(""); setAction("interest"); }}><CheckCircle2 size={17} /> I'm interested</button>
          {property.transactionType === "sale" ? (
            <button type="button" className="btn-outline w-full" onClick={() => { setDone(""); setAction("offer"); }}><HandCoins size={17} /> Make an offer</button>
          ) : (
            <button type="button" className="btn-outline w-full" onClick={() => { setDone(""); setAction("apply"); }}><FileText size={17} /> Apply / express interest</button>
          )}
        </div>
        <div className="mt-5 rounded-xl bg-surface p-3 text-xs leading-5 text-muted-foreground">
          Property reference: <strong className="text-foreground">{property.id}</strong><br />
          Availability shown: {new Date(property.updatedAt).toLocaleDateString("en-LK")}
        </div>
      </div>

      {action ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-ink/65 p-3 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setAction(null); }}>
          <div className="max-h-[94vh] w-full max-w-2xl overflow-auto rounded-2xl bg-background shadow-2xl scrollbar-thin">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
              <div><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{property.id}</p><h2 className="mt-0.5 text-xl font-bold">{heading}</h2></div>
              <button type="button" onClick={() => setAction(null)} className="grid size-9 place-items-center rounded-lg border border-border bg-card"><X size={17} /></button>
            </div>
            {done ? (
              <div className="p-8 text-center"><span className="mx-auto grid size-14 place-items-center rounded-full bg-success/10 text-success"><CheckCircle2 size={28} /></span><h3 className="mt-4 text-2xl font-bold">Received</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{done}</p><button type="button" onClick={() => setAction(null)} className="btn-primary mt-5">Close</button></div>
            ) : (
              <form onSubmit={submit} className="grid gap-4 p-5 sm:p-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold">Name<input className="field mt-1.5" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></label>
                  <label className="text-sm font-semibold">Mobile<input className="field mt-1.5" required value={form.mobile} onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))} /></label>
                  <label className="text-sm font-semibold sm:col-span-2">Email<input className="field mt-1.5" type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} /></label>
                  <label className="text-sm font-semibold">Budget from<input className="field mt-1.5" inputMode="numeric" value={form.budgetMin} onChange={(e) => setForm((p) => ({ ...p, budgetMin: e.target.value.replace(/\D/g, "") }))} /></label>
                  <label className="text-sm font-semibold">Budget to<input className="field mt-1.5" inputMode="numeric" value={form.budgetMax} onChange={(e) => setForm((p) => ({ ...p, budgetMax: e.target.value.replace(/\D/g, "") }))} /></label>
                  <label className="text-sm font-semibold">Timeline<select className="field mt-1.5" value={form.timeline} onChange={(e) => setForm((p) => ({ ...p, timeline: e.target.value }))}><option value="immediate">Immediately</option><option value="30_days">Within 30 days</option><option value="90_days">Within 90 days</option><option value="researching">Researching</option></select></label>
                  {property.transactionType === "sale" ? <label className="text-sm font-semibold">Funding<select className="field mt-1.5" value={form.fundingMethod} onChange={(e) => setForm((p) => ({ ...p, fundingMethod: e.target.value }))}><option value="cash">Cash</option><option value="bank_loan">Bank loan</option><option value="mixed">Mixed</option></select></label> : null}
                </div>

                {action === "viewing" ? <div className="grid gap-4 rounded-xl bg-surface p-4 sm:grid-cols-2"><label className="text-sm font-semibold">Preferred date<input className="field mt-1.5" type="date" required value={form.viewingDate} onChange={(e) => setForm((p) => ({ ...p, viewingDate: e.target.value }))} /></label><label className="text-sm font-semibold">Preferred time<select className="field mt-1.5" value={form.viewingTime} onChange={(e) => setForm((p) => ({ ...p, viewingTime: e.target.value }))}><option>10:00</option><option>11:00</option><option>14:00</option><option>15:30</option><option>17:00</option></select></label></div> : null}
                {action === "offer" ? <div className="grid gap-4 rounded-xl bg-surface p-4 sm:grid-cols-2"><label className="text-sm font-semibold">Offer amount<input className="field mt-1.5" required inputMode="numeric" value={form.offerAmount} onChange={(e) => setForm((p) => ({ ...p, offerAmount: e.target.value.replace(/\D/g, "") }))} /></label><label className="text-sm font-semibold">Completion days<input className="field mt-1.5" required type="number" min="7" value={form.completionDays} onChange={(e) => setForm((p) => ({ ...p, completionDays: e.target.value }))} /></label></div> : null}
                {action === "apply" ? <div className="grid gap-4 rounded-xl bg-surface p-4 sm:grid-cols-2"><label className="text-sm font-semibold">Move-in date<input className="field mt-1.5" type="date" required value={form.moveInDate} onChange={(e) => setForm((p) => ({ ...p, moveInDate: e.target.value }))} /></label><label className="text-sm font-semibold">Lease months<input className="field mt-1.5" type="number" min="1" required value={form.leaseMonths} onChange={(e) => setForm((p) => ({ ...p, leaseMonths: e.target.value }))} /></label><label className="text-sm font-semibold">Occupants<input className="field mt-1.5" type="number" min="1" required value={form.occupants} onChange={(e) => setForm((p) => ({ ...p, occupants: e.target.value }))} /></label><label className="text-sm font-semibold">Occupation<input className="field mt-1.5" required value={form.occupation} onChange={(e) => setForm((p) => ({ ...p, occupation: e.target.value }))} /></label><label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2"><input type="checkbox" checked={form.pets} onChange={(e) => setForm((p) => ({ ...p, pets: e.target.checked }))} /> Pets</label></div> : null}

                <label className="text-sm font-semibold">Notes<textarea className="field mt-1.5 min-h-24" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Anything Royal Keys should know?" /></label>
                <p className="text-xs leading-5 text-muted-foreground">Submitting this form does not create a binding sale, lease or legal agreement. Royal Keys will verify the enquiry and coordinate the next step.</p>
                <button className="btn-primary w-full" type="submit">Submit</button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
