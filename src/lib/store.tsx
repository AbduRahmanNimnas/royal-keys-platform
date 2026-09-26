import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { demoState } from "@/data/demo";
import { calculateLeadScore, commissionAmount, commissionRate, temperatureFromScore } from "@/lib/business";
import type {
  Introduction,
  Lead,
  Offer,
  Owner,
  Property,
  PropertyType,
  RentalApplication,
  RoyalKeysState,
  TransactionType,
  Viewing,
} from "@/types/domain";

const STORAGE_KEY = "royal-keys-platform-v1";

function freshDemoState(): RoyalKeysState {
  return JSON.parse(JSON.stringify(demoState)) as RoyalKeysState;
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export interface OwnerPropertyInput {
  transactionType: TransactionType;
  ownerName: string;
  ownerMobile: string;
  ownerEmail: string;
  propertyType: PropertyType;
  title: string;
  city: string;
  district: string;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  description: string;
  availableFrom: string;
  authorizationConfirmed: boolean;
}

export interface LeadInput {
  transactionType: TransactionType;
  name: string;
  mobile: string;
  email: string;
  budgetMin: number;
  budgetMax: number;
  preferredCities: string[];
  propertyTypes: PropertyType[];
  bedrooms: number | null;
  timeline: Lead["timeline"];
  fundingMethod: Lead["fundingMethod"];
  moveInDate: string | null;
  leaseMonths: number | null;
  viewingReady: boolean;
  propertyPrice?: number;
  source: string;
  notes: string;
}

interface RoyalKeysStore {
  state: RoyalKeysState;
  addOwnerProperty(input: OwnerPropertyInput): Property;
  addLead(input: LeadInput): Lead;
  recordIntroduction(propertyId: string, leadId: string, method: Introduction["method"]): Introduction;
  scheduleViewing(input: Omit<Viewing, "id" | "createdAt" | "status">): Viewing;
  addOffer(input: Omit<Offer, "id" | "createdAt" | "status">): Offer;
  addRentalApplication(
    input: Omit<RentalApplication, "id" | "createdAt" | "status">,
  ): RentalApplication;
  updatePropertyStatus(propertyId: string, status: Property["status"]): void;
  updateLeadStatus(leadId: string, status: Lead["status"]): void;
  acknowledgeIntroduction(introductionId: string): void;
  updateViewingStatus(viewingId: string, status: Viewing["status"]): void;
  updateOfferStatus(offerId: string, status: Offer["status"]): void;
  updateRentalApplicationStatus(applicationId: string, status: RentalApplication["status"]): void;
  markDealWon(propertyId: string, leadId: string, finalAmount: number): void;
  markCommissionInvoiced(commissionId: string): void;
  markCommissionPaid(commissionId: string): void;
  resetDemo(): void;
}

const StoreContext = createContext<RoyalKeysStore | null>(null);

export function RoyalKeysStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RoyalKeysState>(() => freshDemoState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw) as RoyalKeysState);
    } catch {
      // Demo mode should remain usable even if storage is unavailable or corrupt.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota/privacy errors in demo mode.
    }
  }, [hydrated, state]);

  const addOwnerProperty = useCallback((input: OwnerPropertyInput) => {
    const owner: Owner = {
      id: uid("OWN"),
      name: input.ownerName,
      mobile: input.ownerMobile,
      email: input.ownerEmail,
      verified: false,
      createdAt: new Date().toISOString(),
    };
    const prefix = input.transactionType === "sale" ? "RK-S" : "RK-R";
    const property: Property = {
      id: uid(prefix),
      transactionType: input.transactionType,
      propertyType: input.propertyType,
      title: input.title,
      slug: input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      district: input.district,
      city: input.city,
      addressHint: "Exact address withheld until viewing is confirmed",
      price: input.price,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      areaSqft: null,
      landPerches: null,
      furnished: null,
      description: input.description,
      amenities: [],
      images: [
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=85",
      ],
      status: "pending_review",
      ownerId: owner.id,
      ownerAuthorizationConfirmed: input.authorizationConfirmed,
      availableFrom: input.availableFrom,
      featured: false,
      marketingReadiness: 50,
      leadCount: 0,
      viewingsCount: 0,
      offersCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((previous) => ({
      ...previous,
      owners: [owner, ...previous.owners],
      properties: [property, ...previous.properties],
      activities: [
        {
          id: uid("ACT"),
          entityType: "property",
          entityId: property.id,
          action: "property_submitted",
          detail: `${property.id} submitted for ${property.transactionType}.`,
          createdAt: new Date().toISOString(),
        },
        ...previous.activities,
      ],
    }));
    return property;
  }, []);

  const addLead = useCallback((input: LeadInput) => {
    const budgetMatched =
      input.propertyPrice == null ||
      (input.propertyPrice >= input.budgetMin && input.propertyPrice <= input.budgetMax);
    const score = calculateLeadScore({
      timeline: input.timeline,
      verifiedContact: true,
      viewingReady: input.viewingReady,
      budgetMatched,
    });
    const lead: Lead = {
      id: uid("LEAD"),
      transactionType: input.transactionType,
      name: input.name,
      mobile: input.mobile,
      email: input.email,
      budgetMin: input.budgetMin,
      budgetMax: input.budgetMax,
      preferredCities: input.preferredCities,
      propertyTypes: input.propertyTypes,
      bedrooms: input.bedrooms,
      timeline: input.timeline,
      fundingMethod: input.fundingMethod,
      moveInDate: input.moveInDate,
      leaseMonths: input.leaseMonths,
      viewingReady: input.viewingReady,
      verifiedContact: true,
      score,
      temperature: temperatureFromScore(score),
      status: score >= 65 ? "qualified" : "new",
      source: input.source,
      createdAt: new Date().toISOString(),
      notes: input.notes,
    };
    setState((previous) => ({
      ...previous,
      leads: [lead, ...previous.leads],
      activities: [
        {
          id: uid("ACT"),
          entityType: "lead",
          entityId: lead.id,
          action: "lead_created",
          detail: `${lead.name} entered as a ${lead.temperature} ${lead.transactionType} lead (${lead.score}/100).`,
          createdAt: new Date().toISOString(),
        },
        ...previous.activities,
      ],
    }));
    return lead;
  }, []);

  const recordIntroduction = useCallback(
    (propertyId: string, leadId: string, method: Introduction["method"]) => {
      const existing = state.introductions.find(
        (item) => item.propertyId === propertyId && item.leadId === leadId && item.status === "active",
      );
      if (existing) return existing;

      const introducedAt = new Date();
      const protectionUntil = new Date(introducedAt);
      protectionUntil.setMonth(protectionUntil.getMonth() + 6);
      const introduction: Introduction = {
        id: uid("INTRO"),
        propertyId,
        leadId,
        introducedAt: introducedAt.toISOString(),
        method,
        protectionUntil: protectionUntil.toISOString(),
        acknowledgedByOwnerAt: null,
        status: "active",
      };
      setState((previous) => ({
        ...previous,
        introductions: [introduction, ...previous.introductions],
        activities: [
          {
            id: uid("ACT"),
            entityType: "lead",
            entityId: leadId,
            action: "introduction_recorded",
            detail: `Lead ${leadId} introduced to property ${propertyId} via ${method}.`,
            createdAt: introducedAt.toISOString(),
          },
          ...previous.activities,
        ],
      }));
      return introduction;
    },
    [state.introductions],
  );

  const scheduleViewing = useCallback(
    (input: Omit<Viewing, "id" | "createdAt" | "status">) => {
      const viewing: Viewing = {
        ...input,
        id: uid("VIEW"),
        status: "requested",
        createdAt: new Date().toISOString(),
      };
      setState((previous) => ({
        ...previous,
        viewings: [viewing, ...previous.viewings],
        properties: previous.properties.map((property) =>
          property.id === input.propertyId
            ? { ...property, viewingsCount: property.viewingsCount + 1 }
            : property,
        ),
      }));
      return viewing;
    },
    [],
  );

  const addOffer = useCallback((input: Omit<Offer, "id" | "createdAt" | "status">) => {
    const offer: Offer = {
      ...input,
      id: uid("OFF"),
      status: "submitted",
      createdAt: new Date().toISOString(),
    };
    setState((previous) => ({
      ...previous,
      offers: [offer, ...previous.offers],
      properties: previous.properties.map((property) =>
        property.id === input.propertyId
          ? { ...property, offersCount: property.offersCount + 1 }
          : property,
      ),
    }));
    return offer;
  }, []);

  const addRentalApplication = useCallback(
    (input: Omit<RentalApplication, "id" | "createdAt" | "status">) => {
      const application: RentalApplication = {
        ...input,
        id: uid("APP"),
        status: "submitted",
        createdAt: new Date().toISOString(),
      };
      setState((previous) => ({
        ...previous,
        rentalApplications: [application, ...previous.rentalApplications],
      }));
      return application;
    },
    [],
  );

  const updatePropertyStatus = useCallback((propertyId: string, status: Property["status"]) => {
    setState((previous) => ({
      ...previous,
      properties: previous.properties.map((property) =>
        property.id === propertyId ? { ...property, status, updatedAt: new Date().toISOString() } : property,
      ),
    }));
  }, []);

  const updateLeadStatus = useCallback((leadId: string, status: Lead["status"]) => {
    setState((previous) => ({
      ...previous,
      leads: previous.leads.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)),
    }));
  }, []);

  const acknowledgeIntroduction = useCallback((introductionId: string) => {
    setState((previous) => ({
      ...previous,
      introductions: previous.introductions.map((item) =>
        item.id === introductionId ? { ...item, acknowledgedByOwnerAt: new Date().toISOString() } : item,
      ),
    }));
  }, []);

  const updateViewingStatus = useCallback((viewingId: string, status: Viewing["status"]) => {
    setState((previous) => ({
      ...previous,
      viewings: previous.viewings.map((viewing) =>
        viewing.id === viewingId ? { ...viewing, status } : viewing,
      ),
    }));
  }, []);

  const updateOfferStatus = useCallback((offerId: string, status: Offer["status"]) => {
    setState((previous) => ({
      ...previous,
      offers: previous.offers.map((offer) => (offer.id === offerId ? { ...offer, status } : offer)),
    }));
  }, []);

  const updateRentalApplicationStatus = useCallback(
    (applicationId: string, status: RentalApplication["status"]) => {
      setState((previous) => ({
        ...previous,
        rentalApplications: previous.rentalApplications.map((application) =>
          application.id === applicationId ? { ...application, status } : application,
        ),
      }));
    },
    [],
  );

  const markDealWon = useCallback((propertyId: string, leadId: string, finalAmount: number) => {
    setState((previous) => {
      const property = previous.properties.find((item) => item.id === propertyId);
      if (!property) return previous;
      const dealId = uid("DEAL");
      const commissionId = uid("COM");
      const now = new Date().toISOString();
      return {
        ...previous,
        properties: previous.properties.map((item) =>
          item.id === propertyId
            ? { ...item, status: item.transactionType === "sale" ? "sold" : "rented", updatedAt: now }
            : item,
        ),
        introductions: previous.introductions.map((item) =>
          item.propertyId === propertyId && item.leadId === leadId
            ? { ...item, status: "converted" as const }
            : item,
        ),
        deals: [
          {
            id: dealId,
            propertyId,
            leadId,
            transactionType: property.transactionType,
            finalAmount,
            status: "won",
            wonAt: now,
            createdAt: now,
          },
          ...previous.deals,
        ],
        commissions: [
          {
            id: commissionId,
            dealId,
            transactionType: property.transactionType,
            baseAmount: finalAmount,
            rate: commissionRate(property.transactionType),
            amount: commissionAmount(property.transactionType, finalAmount),
            status: "expected",
            invoicedAt: null,
            paidAt: null,
          },
          ...previous.commissions,
        ],
      };
    });
  }, []);

  const markCommissionInvoiced = useCallback((commissionId: string) => {
    setState((previous) => ({
      ...previous,
      commissions: previous.commissions.map((commission) =>
        commission.id === commissionId
          ? { ...commission, status: "invoiced", invoicedAt: new Date().toISOString() }
          : commission,
      ),
    }));
  }, []);

  const markCommissionPaid = useCallback((commissionId: string) => {
    setState((previous) => ({
      ...previous,
      commissions: previous.commissions.map((commission) =>
        commission.id === commissionId
          ? { ...commission, status: "paid", paidAt: new Date().toISOString() }
          : commission,
      ),
    }));
  }, []);

  const resetDemo = useCallback(() => setState(freshDemoState()), []);

  const value = useMemo<RoyalKeysStore>(
    () => ({
      state,
      addOwnerProperty,
      addLead,
      recordIntroduction,
      scheduleViewing,
      addOffer,
      addRentalApplication,
      updatePropertyStatus,
      updateLeadStatus,
      acknowledgeIntroduction,
      updateViewingStatus,
      updateOfferStatus,
      updateRentalApplicationStatus,
      markDealWon,
      markCommissionInvoiced,
      markCommissionPaid,
      resetDemo,
    }),
    [
      state,
      addOwnerProperty,
      addLead,
      recordIntroduction,
      scheduleViewing,
      addOffer,
      addRentalApplication,
      updatePropertyStatus,
      updateLeadStatus,
      acknowledgeIntroduction,
      updateViewingStatus,
      updateOfferStatus,
      updateRentalApplicationStatus,
      markDealWon,
      markCommissionInvoiced,
      markCommissionPaid,
      resetDemo,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useRoyalKeysStore(): RoyalKeysStore {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useRoyalKeysStore must be used inside RoyalKeysStoreProvider");
  return value;
}
