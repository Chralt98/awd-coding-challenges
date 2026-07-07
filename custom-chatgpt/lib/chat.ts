export const NEW_ADVENTURE_TITLE = "New adventure";
export const TITLE_MAX_LENGTH = 40;

export const ADVENTURE_INTRO =
  "Welcome! This is an interactive text adventure — you'll make choices that shape how the story unfolds. Pick a story to begin, or type your own opening line below.";

export const STORY_SUGGESTIONS = [
  "You're a detective called to investigate a locked-room murder in a snowbound mountain lodge.",
  "You discover a hidden door in your basement that leads to a city built beneath your own.",
  "You're the last apprentice of a dying order of wizards, tasked with recovering a stolen relic before the world forgets magic entirely.",
];

/** Derives a readable sidebar title from an adventure's opening prompt. */
export function deriveTitle(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return NEW_ADVENTURE_TITLE;
  return trimmed.length > TITLE_MAX_LENGTH
    ? `${trimmed.slice(0, TITLE_MAX_LENGTH)}...`
    : trimmed;
}
