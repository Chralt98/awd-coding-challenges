export const NEW_ADVENTURE_TITLE = "New adventure";
export const TITLE_MAX_LENGTH = 40;

export const ADVENTURE_INTRO =
  "Welcome! This is an interactive text adventure — you'll make choices that shape how the story unfolds. Pick a story to begin, or type your own opening line below.";

export const STORY_SUGGESTIONS = [
  "You wake up in a dense, fog-covered forest with no memory of how you got there.",
  "You're the captain of a starship that has just received a distress signal from a system everyone thought was dead.",
  "You inherit a mysterious mansion from a relative you've never heard of.",
];

/** Derives a readable sidebar title from an adventure's opening prompt. */
export function deriveTitle(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return NEW_ADVENTURE_TITLE;
  return trimmed.length > TITLE_MAX_LENGTH
    ? `${trimmed.slice(0, TITLE_MAX_LENGTH)}...`
    : trimmed;
}
