/** Derives the 1-2 letter badge shown in the UserMenu footer from an email address. */
export function getInitials(email: string): string {
  const trimmed = email.trim();
  if (!trimmed) return "?";

  const [localPart] = trimmed.split("@");
  const withoutSuffix = localPart.split("+")[0];
  const segments = withoutSuffix.split(".").filter(Boolean);
  if (segments.length === 0) return "?";

  const initials = segments
    .slice(0, 2)
    .map((segment) => segment[0])
    .join("")
    .toUpperCase();

  return initials || "?";
}
