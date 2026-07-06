export const NEW_ADVENTURE_TITLE = "New adventure";
export const TITLE_MAX_LENGTH = 40;

/** Derives a readable sidebar title from an adventure's opening prompt. */
export function deriveTitle(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return NEW_ADVENTURE_TITLE;
  return trimmed.length > TITLE_MAX_LENGTH
    ? `${trimmed.slice(0, TITLE_MAX_LENGTH)}...`
    : trimmed;
}
