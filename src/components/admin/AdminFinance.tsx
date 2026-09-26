import { useState, type FormEvent } from "react";
import { RefreshCw } from "lucide-react";
import { compactLkr, formatLkr } from "@/lib/business";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useRoyalKeysStore } from "@/lib/store";
import type { TransactionType } from "@/types/domain";
import { AdminTable, StatusPill } from "./AdminFrame";

export function DealsPanel() {
  const { state, markDealWon } = useRoyalKeysStore();
  const [propertyId, setPropertyId] = useState("");
  const [leadId, setLeadId] = useState("");
  const [finalAmount, setFinalAmount] = useState("");

  const selected = state.properties.find((property) => property.id === propertyId);
  const suitableLeads = state.leads.filter(
    (lead) => !selected || lead.transactionType === selected.transactionType,
  );

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!propertyId || !leadId || Number(finalAmount) <= 0) return;
    markDealWon(propertyId, leadId, Number(finalAmount));
    setPropertyId("");
    setLeadId("");
    setFinalAmount("");
  }

  return <div className="space-y-5">
    <form onSubmit={submit} className="card-surface grid gap-4 p-5 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
      <label className="text-sm font-bold">Property
        <select className="field mt-1.5" required value={propertyId} onChange={(event)=>setPropertyId(event.target.value)}>
          <option value="">Select property</option>
          {state.properties.filter((property)=>!["sold","rented","archived"].includes(property.status)).map((property)=><option key={property.id} value={property.id}>{property.id} · {property.title}</option>)}
        </select>
      </label>
      <label className="text-sm font-bold">Buyer / tenant
        <select className="field mt-1.5" required value={leadId} onChange={(event)=>setLeadId(event.target.value)}>
          <option value="">Select lead</option>
          {suitableLeads.map((lead)=><option key={lead.id} value={lead.id}>{lead.id} · {lead.name}</option>)}
        </select>
      </label>
      <label className="text-sm font-bold">Final sale price / agreed monthly rent
        <input className="field mt-1.5" required inputMode="numeric" value={finalAmount} onChange={(event)=>setFinalAmount(event.target.value.replace(/\D/g,""))} />
      </label>
      <button className="btn-primary" type="submit">Mark won</button>
    </form>

    <AdminTable title="Closed / tracked deals" description="A won deal automatically generates the correct commission record.">
      <table><thead><tr><th>Deal</th><th>Property</th><th>Lead</th><th>Type</th><th>Final amount</th><th>Status</th></tr></thead><tbody>
        {state.deals.map((deal)=><tr key={deal.id}><td className="font-bold">{deal.id}</td><td>{deal.propertyId}</td><td>{deal.leadId}</td><td className="capitalize">{deal.transactionType}</td><td className="font-bold">{formatLkr(deal.finalAmount)}</td><td><StatusPill value={deal.status} /></td></tr>)}
      </tbody></table>
    </AdminTable>
  </div>;
}

export function CommissionsPanel() {
  const { state, markCommissionInvoiced, markCommissionPaid }=useRoyalKeysStore();
  const [type,setType]=useState<TransactionType>("sale");
  const [amount,setAmount]=useState("50000000");
  const numeric=Number(amount||0);
  const illustration=type==="sale"?numeric*0.03:numeric*0.5;

  return <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
    <AdminTable title="Commission ledger" description="Sale = 3% of final successful price. Rental placement = 50% of one month's agreed rent.">
      <table><thead><tr><th>Commission</th><th>Deal</th><th>Base</th><th>Fee</th><th>Status</th><th>Action</th></tr></thead><tbody>
        {state.commissions.map((commission)=><tr key={commission.id}>
          <td className="font-bold">{commission.id}</td><td>{commission.dealId}</td><td>{compactLkr(commission.baseAmount)}</td><td className="font-black text-primary">{formatLkr(commission.amount)}</td><td><StatusPill value={commission.status} /></td>
          <td>{commission.status==="expected"?<button type="button" className="btn-outline min-h-0 py-2 text-xs" onClick={()=>markCommissionInvoiced(commission.id)}>Mark invoiced</button>:null}{commission.status==="invoiced"?<button type="button" className="btn-primary min-h-0 py-2 text-xs" onClick={()=>markCommissionPaid(commission.id)}>Mark paid</button>:null}{commission.status==="paid"?<span className="text-xs font-bold text-success">Complete</span>:null}</td>
        </tr>)}
      </tbody></table>
    </AdminTable>

    <section className="rounded-2xl bg-ink p-6 text-white">
      <p className="text-xs font-black uppercase tracking-[.14em] text-gold">Calculator</p>
      <h2 className="mt-2 text-2xl font-black">Success-fee illustration</h2>
      <div className="mt-5 grid gap-4">
        <label className="text-sm font-bold">Deal type
          <select className="field mt-1.5 text-foreground" value={type} onChange={(event)=>setType(event.target.value as TransactionType)}>
            <option value="sale">Property sale — 3%</option><option value="rent">Rental placement — 50% of one month</option>
          </select>
        </label>
        <label className="text-sm font-bold">{type==="sale"?"Final sale price":"Agreed monthly rent"}
          <input className="field mt-1.5 text-foreground" inputMode="numeric" value={amount} onChange={(event)=>setAmount(event.target.value.replace(/\D/g,""))} />
        </label>
        <div className="rounded-xl bg-white/[.08] p-4"><p className="text-xs text-white/50">Calculated commission</p><p className="mt-1 text-3xl font-black text-gold">{formatLkr(illustration)}</p></div>
      </div>
    </section>
  </div>;
}

export function TasksPanel() {
  const {state}=useRoyalKeysStore();
  const rows=[
    ...state.properties.filter((property)=>property.status==="pending_review").map((property)=>({title:`Review ${property.id}`,detail:property.title,priority:"High"})),
    ...state.viewings.filter((viewing)=>viewing.status==="requested").map((viewing)=>({title:`Confirm viewing ${viewing.id}`,detail:`${viewing.propertyId} · ${new Date(viewing.startsAt).toLocaleString("en-LK")}`,priority:"High"})),
    ...state.introductions.filter((intro)=>!intro.acknowledgedByOwnerAt).map((intro)=>({title:`Owner acknowledgement ${intro.id}`,detail:`${intro.propertyId} ↔ ${intro.leadId}`,priority:"Medium"})),
    ...state.commissions.filter((commission)=>commission.status==="invoiced").map((commission)=>({title:`Follow up invoice ${commission.id}`,detail:formatLkr(commission.amount),priority:"Medium"})),
  ];
  return <div className="grid gap-3">{rows.length?rows.map((task,index)=><div key={`${task.title}-${index}`} className="card-surface flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="font-bold">{task.title}</p><p className="mt-1 text-xs text-muted-foreground">{task.detail}</p></div><span className="rounded-full bg-warning/15 px-3 py-1 text-xs font-bold">{task.priority}</span></div>):<div className="card-surface p-8 text-center text-sm text-muted-foreground">No follow-ups generated from current data.</div>}</div>;
}

export function SettingsPanel() {
  const {resetDemo}=useRoyalKeysStore();
  return <div className="grid gap-5 lg:grid-cols-2">
    <section className="card-surface p-6"><h2 className="text-xl font-bold">Business rules</h2><div className="mt-4 grid gap-3 text-sm">
      <div className="rounded-xl bg-surface p-4"><p className="font-bold">Sale brokerage</p><p className="mt-1 text-muted-foreground">3% of the final successful transaction price.</p></div>
      <div className="rounded-xl bg-surface p-4"><p className="font-bold">Rental placement</p><p className="mt-1 text-muted-foreground">50% of one month's agreed rent after successful tenant placement.</p></div>
      <div className="rounded-xl bg-surface p-4"><p className="font-bold">Introduction protection</p><p className="mt-1 text-muted-foreground">Demo defaults to six months. Production must mirror the final signed agency agreement.</p></div>
    </div></section>
    <section className="card-surface p-6"><h2 className="text-xl font-bold">Environment</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{isSupabaseConfigured?"Supabase environment variables are configured. Staff authentication is active.":"No Supabase credentials detected. The app is running in local demo mode with browser persistence."}</p>{!isSupabaseConfigured?<button type="button" className="btn-outline mt-5" onClick={resetDemo}><RefreshCw size={16}/> Reset demo data</button>:null}<div className="mt-5 rounded-xl bg-destructive/5 p-4 text-xs leading-5 text-muted-foreground">Do not place service-role keys, payment secrets, WhatsApp tokens or document-storage credentials in browser environment variables.</div></section>
  </div>;
}
