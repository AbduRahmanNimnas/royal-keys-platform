import { Link } from "@tanstack/react-router";
import { compactLkr } from "@/lib/business";
import { useRoyalKeysStore } from "@/lib/store";
import { AdminTable, StatusPill } from "./AdminFrame";

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return <div className="card-surface p-5"><p className="text-xs font-black uppercase tracking-[.12em] text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-black text-ink">{value}</p></div>;
}

export function AdminOverview() {
  const { state } = useRoyalKeysStore();
  const saleListings = state.properties.filter((item) => item.transactionType === "sale" && ["live", "under_offer"].includes(item.status)).length;
  const rentals = state.properties.filter((item) => item.transactionType === "rent" && ["live", "under_offer"].includes(item.status)).length;
  const qualified = state.leads.filter((lead) => ["qualified", "viewing", "negotiating"].includes(lead.status)).length;
  const openOffers = state.offers.filter((offer) => ["submitted", "countered"].includes(offer.status)).length;
  const expected = state.commissions.filter((item) => item.status !== "paid").reduce((sum, item) => sum + item.amount, 0);
  const collected = state.commissions.filter((item) => item.status === "paid").reduce((sum, item) => sum + item.amount, 0);
  const hot = state.leads.filter((lead) => lead.temperature === "hot").slice(0, 5);
  const upcoming = [...state.viewings].filter((item) => ["requested", "confirmed"].includes(item.status)).sort((a,b)=>a.startsAt.localeCompare(b.startsAt)).slice(0, 5);

  return <div className="space-y-6">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Active sale listings" value={saleListings} />
      <MetricCard label="Active rentals" value={rentals} />
      <MetricCard label="Qualified leads" value={qualified} />
      <MetricCard label="Viewings in pipeline" value={upcoming.length} />
      <MetricCard label="Open offers" value={openOffers} />
      <MetricCard label="Deals won" value={state.deals.filter((deal)=>deal.status==="won").length} />
      <MetricCard label="Expected commission" value={compactLkr(expected)} />
      <MetricCard label="Collected commission" value={compactLkr(collected)} />
    </div>

    <div className="grid gap-5 xl:grid-cols-2">
      <AdminTable title="Hot leads" description="Operational prioritization only; not a credit, legal or financial score.">
        <table><thead><tr><th>Lead</th><th>Need</th><th>Score</th><th>Status</th></tr></thead><tbody>
          {hot.map((lead)=><tr key={lead.id}>
            <td><p className="font-bold">{lead.name}</p><p className="text-xs text-muted-foreground">{lead.id}</p></td>
            <td className="capitalize">{lead.transactionType === "sale" ? "Buyer" : "Tenant"} · {lead.preferredCities.join(", ")}</td>
            <td><span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-black text-destructive">{lead.score}/100</span></td>
            <td><StatusPill value={lead.status} /></td>
          </tr>)}
        </tbody></table>
      </AdminTable>

      <AdminTable title="Upcoming viewings">
        <table><thead><tr><th>When</th><th>Property</th><th>Lead</th><th>Status</th></tr></thead><tbody>
          {upcoming.map((viewing)=>{
            const property=state.properties.find((item)=>item.id===viewing.propertyId);
            const lead=state.leads.find((item)=>item.id===viewing.leadId);
            return <tr key={viewing.id}>
              <td className="whitespace-nowrap">{new Date(viewing.startsAt).toLocaleString("en-LK")}</td>
              <td>{property ? <Link to="/property/$id" params={{id:property.id}} className="font-bold hover:underline">{property.title}</Link> : viewing.propertyId}</td>
              <td>{lead?.name ?? viewing.leadId}</td>
              <td><StatusPill value={viewing.status} /></td>
            </tr>;
          })}
        </tbody></table>
      </AdminTable>
    </div>
  </div>;
}
