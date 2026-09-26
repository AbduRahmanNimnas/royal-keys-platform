import { createFileRoute } from "@tanstack/react-router";
import { OwnerListingForm } from "@/components/OwnerListingForm";
import { PublicLayout } from "@/components/PublicLayout";

export const Route = createFileRoute("/sell")({ component: SellPage });
function SellPage() {
  return <PublicLayout><section className="border-b border-border bg-surface/60 py-12"><div className="page-shell"><p className="eyebrow">Sell with Royal Keys</p><h1 className="mt-2 max-w-3xl text-5xl font-black text-ink">3% only when your property is successfully sold.</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">Submit the property for brokerage review. Royal Keys can manage marketing, buyer qualification, viewings, offers and the deal pipeline. Final engagement is subject to signed agency terms.</p></div></section><section className="page-shell py-10"><OwnerListingForm transactionType="sale" /></section></PublicLayout>;
}
