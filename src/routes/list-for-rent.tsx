import { createFileRoute } from "@tanstack/react-router";
import { OwnerListingForm } from "@/components/OwnerListingForm";
import { PublicLayout } from "@/components/PublicLayout";

export const Route = createFileRoute("/list-for-rent")({ component: LetPage });
function LetPage() {
  return <PublicLayout><section className="border-b border-border bg-surface/60 py-12"><div className="page-shell"><p className="eyebrow">Find a tenant</p><h1 className="mt-2 max-w-3xl text-5xl font-black text-ink">Half of one month's rent when we successfully place the tenant.</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">No need to publish your phone number. Royal Keys captures enquiries, qualifies tenants, coordinates viewings and records applications. Final engagement is subject to signed agency terms.</p></div></section><section className="page-shell py-10"><OwnerListingForm transactionType="rent" /></section></PublicLayout>;
}
