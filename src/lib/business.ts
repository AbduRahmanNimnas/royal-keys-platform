import type { Lead, LeadTemperature, Property, TransactionType } from "@/types/domain";

export function formatLkr(value: number): string {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function compactLkr(value: number): string {
  if (value >= 1_000_000_000) return `Rs. ${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `Rs. ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `Rs. ${(value / 1_000).toFixed(0)}K`;
  return `Rs. ${value.toLocaleString("en-LK")}`;
}

export function commissionAmount(type: TransactionType, finalAmount: number): number {
  return type === "sale" ? finalAmount * 0.03 : finalAmount * 0.5;
}

export function commissionRate(type: TransactionType): number {
  return type === "sale" ? 0.03 : 0.5;
}

export interface LeadScoreInput {
  timeline: Lead["timeline"];
  verifiedContact: boolean;
  viewingReady: boolean;
  budgetMatched: boolean;
}

export function calculateLeadScore(input: LeadScoreInput): number {
  const timelinePoints: Record<Lead["timeline"], number> = {
    immediate: 35,
    "30_days": 28,
    "90_days": 18,
    researching: 7,
  };
  return Math.min(
    100,
    timelinePoints[input.timeline] +
      (input.verifiedContact ? 20 : 0) +
      (input.viewingReady ? 25 : 0) +
      (input.budgetMatched ? 20 : 0),
  );
}

export function temperatureFromScore(score: number): LeadTemperature {
  if (score >= 75) return "hot";
  if (score >= 45) return "warm";
  return "cold";
}

export function propertyLeadMatch(property: Property, lead: Lead): number {
  if (property.transactionType !== lead.transactionType) return 0;
  let score = 25;
  const cityMatch = lead.preferredCities.some(
    (city) => city.toLowerCase() === property.city.toLowerCase(),
  );
  if (cityMatch) score += 25;
  if (lead.propertyTypes.includes(property.propertyType)) score += 20;
  if (property.price >= lead.budgetMin && property.price <= lead.budgetMax) score += 20;
  if (lead.bedrooms == null || property.bedrooms == null || property.bedrooms >= lead.bedrooms) score += 10;
  return Math.min(score, 100);
}

export function matchExplanation(property: Property, lead: Lead): string[] {
  const reasons: string[] = [];
  if (lead.preferredCities.some((x) => x.toLowerCase() === property.city.toLowerCase())) {
    reasons.push("preferred area");
  }
  if (lead.propertyTypes.includes(property.propertyType)) reasons.push("property type");
  if (property.price >= lead.budgetMin && property.price <= lead.budgetMax) reasons.push("within budget");
  if (lead.bedrooms == null || property.bedrooms == null || property.bedrooms >= lead.bedrooms) {
    reasons.push("bedroom requirement");
  }
  return reasons;
}
