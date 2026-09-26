import { Link } from "@tanstack/react-router";
import { compactLkr, formatLkr, matchExplanation, propertyLeadMatch } from "@/lib/business";
import { useRoyalKeysStore } from "@/lib/store";
import type { Lead, Offer, Property, RentalApplication, Viewing } from "@/types/domain";
import { AdminTable, StatusPill } from "./AdminFrame";

export function PropertiesPanel() {
  const { state, updatePropertyStatus } = useRoyalKeysStore();
  return <AdminTable title="Property inventory" description="Approve, publish, move under offer and close properties while preserving owner attribution.">
    <table><thead><tr><th>Property</th><th>Type</th><th>Asking</th><th>Readiness</th><th>Owner</th><th>Status</th></tr></thead><tbody>
      {state.properties.map((property)=>{
        const owner=state.owners.find((item)=>item.id===property.ownerId);
        return <tr key={property.id}>
          <td><Link to="/property/$id" params={{id:property.id}} className="font-bold hover:underline">{property.title}</Link><p className="mt-1 text-xs text-muted-foreground">{property.id} · {property.city}</p></td>
          <td className="capitalize">{property.transactionType} · {property.propertyType}</td>
          <td className="font-bold">{compactLkr(property.price)}</td>
          <td>{property.marketingReadiness}/100</td>
          <td>{owner?.name ?? "Unknown"}</td>
          <td><select className="field min-w-40 py-2" value={property.status} onChange={(event)=>updatePropertyStatus(property.id,event.target.value as Property["status"])}>
            <option value="draft">Draft</option><option value="pending_review">Pending review</option><option value="live">Live</option><option value="under_offer">Under offer</option><option value="sold">Sold</option><option value="rented">Rented</option><option value="archived">Archived</option>
          </select></td>
        </tr>;
      })}
    </tbody></table>
  </AdminTable>;
}

export function OwnersPanel() {
  const { state }=useRoyalKeysStore();
  return <AdminTable title="Owners" description="Owner contact is visible only to brokerage staff, never on public property pages.">
    <table><thead><tr><th>Owner</th><th>Contact</th><th>Verification</th><th>Properties</th><th>Created</th></tr></thead><tbody>
      {state.owners.map((owner)=><tr key={owner.id}>
        <td><p className="font-bold">{owner.name}</p><p className="text-xs text-muted-foreground">{owner.id}</p></td>
        <td><p>{owner.mobile}</p><p className="text-xs text-muted-foreground">{owner.email}</p></td>
        <td><StatusPill value={owner.verified?"verified":"pending"} /></td>
        <td>{state.properties.filter((property)=>property.ownerId===owner.id).length}</td>
        <td>{new Date(owner.createdAt).toLocaleDateString("en-LK")}</td>
      </tr>)}
    </tbody></table>
  </AdminTable>;
}

export function LeadsPanel() {
  const { state, updateLeadStatus }=useRoyalKeysStore();
  return <AdminTable title="Buyer & tenant pipeline" description="Lead score is operational prioritization only; it is not a credit, legal or financial eligibility score.">
    <table><thead><tr><th>Lead</th><th>Requirement</th><th>Budget</th><th>Score</th><th>Source</th><th>Pipeline</th></tr></thead><tbody>
      {state.leads.map((lead)=><tr key={lead.id}>
        <td><p className="font-bold">{lead.name}</p><p className="text-xs text-muted-foreground">{lead.mobile}<br />{lead.email}</p></td>
        <td className="capitalize">{lead.transactionType==="sale"?"Buyer":"Tenant"} · {lead.propertyTypes.join(", ")}<p className="text-xs text-muted-foreground">{lead.preferredCities.join(", ")}</p></td>
        <td>{compactLkr(lead.budgetMin)} – {compactLkr(lead.budgetMax)}</td>
        <td><span className={`rounded-full px-2.5 py-1 text-xs font-black ${lead.temperature==="hot"?"bg-destructive/10 text-destructive":lead.temperature==="warm"?"bg-warning/15":"bg-surface text-muted-foreground"}`}>{lead.score} · {lead.temperature}</span></td>
        <td>{lead.source}</td>
        <td><select className="field min-w-36 py-2" value={lead.status} onChange={(event)=>updateLeadStatus(lead.id,event.target.value as Lead["status"])}>
          <option value="new">New</option><option value="qualified">Qualified</option><option value="viewing">Viewing</option><option value="negotiating">Negotiating</option><option value="won">Won</option><option value="lost">Lost</option>
        </select></td>
      </tr>)}
    </tbody></table>
  </AdminTable>;
}

export function MatchesPanel() {
  const {state}=useRoyalKeysStore();
  const rows=state.leads.flatMap((lead)=>state.properties.filter((property)=>["live","under_offer"].includes(property.status)).map((property)=>({lead,property,score:propertyLeadMatch(property,lead),reasons:matchExplanation(property,lead)}))).filter((item)=>item.score>=55).sort((a,b)=>b.score-a.score).slice(0,40);
  return <AdminTable title="Match Center" description="Explainable matching uses transaction type, area, property type, budget and bedroom requirement.">
    <table><thead><tr><th>Lead</th><th>Property</th><th>Match</th><th>Why</th><th>Action</th></tr></thead><tbody>
      {rows.map((item)=><tr key={`${item.lead.id}-${item.property.id}`}>
        <td><p className="font-bold">{item.lead.name}</p><p className="text-xs text-muted-foreground">{item.lead.id}</p></td>
        <td><p className="font-bold">{item.property.title}</p><p className="text-xs text-muted-foreground">{item.property.id}</p></td>
        <td><span className="rounded-full bg-success/10 px-3 py-1 text-xs font-black text-success">{item.score}%</span></td>
        <td className="text-xs text-muted-foreground">{item.reasons.join(" · ")}</td>
        <td><Link to="/property/$id" params={{id:item.property.id}} className="btn-outline min-h-0 py-2 text-xs">Open property</Link></td>
      </tr>)}
    </tbody></table>
  </AdminTable>;
}

export function IntroductionsPanel() {
  const {state,acknowledgeIntroduction}=useRoyalKeysStore();
  return <AdminTable title="Introduction register" description="Audit trail tying a lead to a property. Protection dates must match the final signed agency agreement.">
    <table><thead><tr><th>Lead</th><th>Property</th><th>Method</th><th>Introduced</th><th>Protection until</th><th>Owner acknowledgement</th></tr></thead><tbody>
      {state.introductions.map((intro)=>{
        const lead=state.leads.find((item)=>item.id===intro.leadId);
        const property=state.properties.find((item)=>item.id===intro.propertyId);
        return <tr key={intro.id}>
          <td><p className="font-bold">{lead?.name??intro.leadId}</p><p className="text-xs text-muted-foreground">{intro.leadId}</p></td>
          <td>{property?.title??intro.propertyId}</td><td className="capitalize">{intro.method}</td>
          <td>{new Date(intro.introducedAt).toLocaleDateString("en-LK")}</td><td>{new Date(intro.protectionUntil).toLocaleDateString("en-LK")}</td>
          <td>{intro.acknowledgedByOwnerAt?<span className="text-xs font-bold text-success">Acknowledged</span>:<button type="button" className="btn-outline min-h-0 py-2 text-xs" onClick={()=>acknowledgeIntroduction(intro.id)}>Record acknowledgement</button>}</td>
        </tr>;
      })}
    </tbody></table>
  </AdminTable>;
}

export function ViewingsPanel() {
  const {state,updateViewingStatus}=useRoyalKeysStore();
  return <AdminTable title="Viewings" description="Keep access, lead identity and appointment outcome tied to the same property record.">
    <table><thead><tr><th>Date</th><th>Property</th><th>Lead</th><th>Notes</th><th>Status</th></tr></thead><tbody>
      {[...state.viewings].sort((a,b)=>a.startsAt.localeCompare(b.startsAt)).map((viewing)=>{
        const property=state.properties.find((item)=>item.id===viewing.propertyId);
        const lead=state.leads.find((item)=>item.id===viewing.leadId);
        return <tr key={viewing.id}><td className="whitespace-nowrap">{new Date(viewing.startsAt).toLocaleString("en-LK")}</td><td>{property?.title??viewing.propertyId}</td><td>{lead?.name??viewing.leadId}</td><td className="text-xs text-muted-foreground">{viewing.notes||"—"}</td><td><select className="field min-w-36 py-2" value={viewing.status} onChange={(event)=>updateViewingStatus(viewing.id,event.target.value as Viewing["status"])}><option value="requested">Requested</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="no_show">No-show</option></select></td></tr>;
      })}
    </tbody></table>
  </AdminTable>;
}

export function OffersPanel() {
  const {state,updateOfferStatus}=useRoyalKeysStore();
  return <AdminTable title="Sale offers" description="Track submitted, countered and accepted offers before a deal is marked won.">
    <table><thead><tr><th>Property</th><th>Buyer</th><th>Offer</th><th>Funding</th><th>Completion</th><th>Status</th></tr></thead><tbody>
      {state.offers.map((offer)=>{
        const property=state.properties.find((item)=>item.id===offer.propertyId);
        const lead=state.leads.find((item)=>item.id===offer.leadId);
        return <tr key={offer.id}><td>{property?.title??offer.propertyId}</td><td>{lead?.name??offer.leadId}</td><td className="font-bold">{formatLkr(offer.amount)}</td><td className="capitalize">{offer.fundingMethod.replace("_"," ")}</td><td>{offer.completionDays} days</td><td><select className="field min-w-36 py-2" value={offer.status} onChange={(event)=>updateOfferStatus(offer.id,event.target.value as Offer["status"])}><option value="submitted">Submitted</option><option value="countered">Countered</option><option value="accepted">Accepted</option><option value="declined">Declined</option><option value="withdrawn">Withdrawn</option></select></td></tr>;
      })}
    </tbody></table>
  </AdminTable>;
}

export function ApplicationsPanel() {
  const {state,updateRentalApplicationStatus}=useRoyalKeysStore();
  return <AdminTable title="Rental applications" description="Keep tenant fit, move-in terms and acceptance status in one place.">
    <table><thead><tr><th>Property</th><th>Tenant</th><th>Move-in</th><th>Lease</th><th>Profile</th><th>Status</th></tr></thead><tbody>
      {state.rentalApplications.map((application)=>{
        const property=state.properties.find((item)=>item.id===application.propertyId);
        const lead=state.leads.find((item)=>item.id===application.leadId);
        return <tr key={application.id}><td>{property?.title??application.propertyId}</td><td>{lead?.name??application.leadId}</td><td>{new Date(application.proposedMoveInDate).toLocaleDateString("en-LK")}</td><td>{application.leaseMonths} months</td><td className="text-xs">{application.occupants} occupant(s) · {application.occupation||"Not provided"} · {application.pets?"Pets":"No pets"}</td><td><select className="field min-w-36 py-2" value={application.status} onChange={(event)=>updateRentalApplicationStatus(application.id,event.target.value as RentalApplication["status"])}><option value="submitted">Submitted</option><option value="shortlisted">Shortlisted</option><option value="accepted">Accepted</option><option value="declined">Declined</option><option value="withdrawn">Withdrawn</option></select></td></tr>;
      })}
    </tbody></table>
  </AdminTable>;
}
