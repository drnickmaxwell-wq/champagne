export const STUB_AUTH_DISABLED_MESSAGE =
  "Stub auth is disabled in production.";
export const STUB_AUTH_DISABLED_STATUS = 403;

export const isStubAuthEnabled = () => process.env.NODE_ENV !== "production";

export const getStubCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
});
