import { createFileRoute } from "@tanstack/react-router";
import { ListingPage, type ListingSearch } from "@/components/ListingPage";

function parseSearch(search: Record<string, unknown>): ListingSearch {
  return {
    location: typeof search.location === "string" ? search.location : "",
    propertyType: typeof search.propertyType === "string" ? search.propertyType : "",
    min: typeof search.min === "string" ? search.min : "",
    max: typeof search.max === "string" ? search.max : "",
    bedrooms: typeof search.bedrooms === "string" ? search.bedrooms : "",
  };
}

export const Route = createFileRoute("/rent")({ validateSearch: parseSearch, component: RentPage });
function RentPage() { return <ListingPage transactionType="rent" search={Route.useSearch()} />; }
