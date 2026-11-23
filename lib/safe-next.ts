/** Only allow same-site relative redirects after sign-in, so ?next= cannot send learners elsewhere. */
export function safeNext(value: string | null | undefined, fallback = "/learn"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
