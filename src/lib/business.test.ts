import { describe, expect, it } from "vitest";
import { calculateLeadScore, commissionAmount, temperatureFromScore } from "./business";

describe("Royal Keys business rules", () => {
  it("calculates 3% sale commission", () => {
    expect(commissionAmount("sale", 50_000_000)).toBe(1_500_000);
  });

  it("calculates half-month rental commission", () => {
    expect(commissionAmount("rent", 200_000)).toBe(100_000);
  });

  it("scores high-intent verified viewing-ready leads as hot", () => {
    const score = calculateLeadScore({
      timeline: "immediate",
      verifiedContact: true,
      viewingReady: true,
      budgetMatched: true,
    });
    expect(score).toBe(100);
    expect(temperatureFromScore(score)).toBe("hot");
  });
});
