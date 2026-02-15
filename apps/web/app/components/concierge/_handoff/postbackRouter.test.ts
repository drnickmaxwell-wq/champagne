import { describe, expect, it } from "vitest";
import { resolveHandoffEndpoint, resolveHandoffKind } from "./postbackRouter";

describe("resolveHandoffKind", () => {
  it("maps booking payload variants", () => {
    expect(resolveHandoffKind("BOOKING_REQUEST")).toBe("BOOKING");
    expect(resolveHandoffKind('{"kind":"handoff","form":"booking"}')).toBe("BOOKING");
    expect(resolveHandoffKind('{"type":"BOOKING"}')).toBe("BOOKING");
  });

  it("maps emergency and new patient payload variants", () => {
    expect(resolveHandoffKind('{"kind":"handoff","form":"emergency_callback"}')).toBe("EMERGENCY_CALLBACK");
    expect(resolveHandoffKind('{"kind":"handoff","form":"new_patient"}')).toBe("NEW_PATIENT");
  });

  it("returns null for non-handoff payloads", () => {
    expect(resolveHandoffKind("book appointment")).toBeNull();
    expect(resolveHandoffKind('{"kind":"other"}')).toBeNull();
  });
});

describe("resolveHandoffEndpoint", () => {
  it("returns correct endpoint path for each handoff type", () => {
    expect(resolveHandoffEndpoint("BOOKING")).toBe("/api/handoff/booking");
    expect(resolveHandoffEndpoint("EMERGENCY_CALLBACK")).toBe("/api/handoff/emergency-callback");
    expect(resolveHandoffEndpoint("NEW_PATIENT")).toBe("/api/handoff/new-patient");
  });

  it("selects expected endpoint from parsed postback payloads", () => {
    const bookingKind = resolveHandoffKind('{"kind":"handoff","form":"booking"}');
    const emergencyKind = resolveHandoffKind('{"kind":"handoff","form":"emergency_callback"}');
    const newPatientKind = resolveHandoffKind('{"kind":"handoff","form":"new_patient"}');

    expect(bookingKind && resolveHandoffEndpoint(bookingKind)).toBe("/api/handoff/booking");
    expect(emergencyKind && resolveHandoffEndpoint(emergencyKind)).toBe("/api/handoff/emergency-callback");
    expect(newPatientKind && resolveHandoffEndpoint(newPatientKind)).toBe("/api/handoff/new-patient");
  });
});
