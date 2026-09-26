export type TransactionType = "sale" | "rent";
export type PropertyStatus =
  | "draft"
  | "pending_review"
  | "live"
  | "under_offer"
  | "sold"
  | "rented"
  | "archived";
export type PropertyType = "apartment" | "house" | "land" | "commercial" | "villa";
export type LeadTemperature = "hot" | "warm" | "cold";
export type LeadStatus = "new" | "qualified" | "viewing" | "negotiating" | "won" | "lost";
export type CommissionStatus = "expected" | "invoiced" | "paid";

export interface Owner {
  id: string;
  name: string;
  mobile: string;
  email: string;
  verified: boolean;
  createdAt: string;
}

export interface Property {
  id: string;
  transactionType: TransactionType;
  propertyType: PropertyType;
  title: string;
  slug: string;
  district: string;
  city: string;
  addressHint: string;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqft: number | null;
  landPerches: number | null;
  furnished: "furnished" | "semi_furnished" | "unfurnished" | null;
  description: string;
  amenities: string[];
  images: string[];
  status: PropertyStatus;
  ownerId: string;
  ownerAuthorizationConfirmed: boolean;
  availableFrom: string;
  featured: boolean;
  marketingReadiness: number;
  leadCount: number;
  viewingsCount: number;
  offersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  transactionType: TransactionType;
  name: string;
  mobile: string;
  email: string;
  budgetMin: number;
  budgetMax: number;
  preferredCities: string[];
  propertyTypes: PropertyType[];
  bedrooms: number | null;
  timeline: "immediate" | "30_days" | "90_days" | "researching";
  fundingMethod: "cash" | "bank_loan" | "mixed" | "not_applicable";
  moveInDate: string | null;
  leaseMonths: number | null;
  viewingReady: boolean;
  verifiedContact: boolean;
  score: number;
  temperature: LeadTemperature;
  status: LeadStatus;
  source: string;
  createdAt: string;
  notes: string;
}


export interface Introduction {
  id: string;
  propertyId: string;
  leadId: string;
  introducedAt: string;
  method: "interest" | "viewing" | "offer" | "application" | "manual";
  protectionUntil: string;
  acknowledgedByOwnerAt: string | null;
  status: "active" | "expired" | "converted";
}

export interface Viewing {
  id: string;
  propertyId: string;
  leadId: string;
  startsAt: string;
  status: "requested" | "confirmed" | "completed" | "cancelled" | "no_show";
  notes: string;
  createdAt: string;
}

export interface Offer {
  id: string;
  propertyId: string;
  leadId: string;
  amount: number;
  fundingMethod: "cash" | "bank_loan" | "mixed";
  completionDays: number;
  status: "submitted" | "countered" | "accepted" | "declined" | "withdrawn";
  notes: string;
  createdAt: string;
}

export interface RentalApplication {
  id: string;
  propertyId: string;
  leadId: string;
  proposedMoveInDate: string;
  leaseMonths: number;
  occupants: number;
  occupation: string;
  pets: boolean;
  status: "submitted" | "shortlisted" | "accepted" | "declined" | "withdrawn";
  notes: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  propertyId: string;
  leadId: string;
  transactionType: TransactionType;
  finalAmount: number;
  status: "open" | "won" | "lost";
  wonAt: string | null;
  createdAt: string;
}

export interface Commission {
  id: string;
  dealId: string;
  transactionType: TransactionType;
  baseAmount: number;
  rate: number;
  amount: number;
  status: CommissionStatus;
  invoicedAt: string | null;
  paidAt: string | null;
}

export interface Activity {
  id: string;
  entityType: "property" | "lead" | "viewing" | "offer" | "deal" | "commission";
  entityId: string;
  action: string;
  detail: string;
  createdAt: string;
}

export interface RoyalKeysState {
  owners: Owner[];
  properties: Property[];
  leads: Lead[];
  introductions: Introduction[];
  viewings: Viewing[];
  offers: Offer[];
  rentalApplications: RentalApplication[];
  deals: Deal[];
  commissions: Commission[];
  activities: Activity[];
}
