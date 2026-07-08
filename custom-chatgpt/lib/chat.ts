import type { Language } from "./stories";

export const NEW_ADVENTURE_TITLE = "New adventure";
export const TITLE_MAX_LENGTH = 40;

const ADVENTURE_INTRO_BY_LANGUAGE: Record<Language, string> = {
  english:
    "Welcome! This is an interactive text adventure — you'll make choices that shape how the story unfolds. Pick a story to begin, or type your own opening line below.",
  german:
    "Willkommen! Dies ist ein interaktives Textabenteuer — deine Entscheidungen bestimmen, wie sich die Geschichte entwickelt. Wähle eine Geschichte, um zu beginnen, oder schreibe unten deine eigene Eröffnungszeile.",
};

const STORY_SUGGESTIONS_BY_LANGUAGE: Record<Language, string[]> = {
  english: [
    "You're a detective called to investigate a locked-room murder in a snowbound mountain lodge.",
    "You discover a hidden door in your basement that leads to a city built beneath your own.",
    "You're the last apprentice of a dying order of wizards, tasked with recovering a stolen relic before the world forgets magic entirely.",
  ],
  german: [
    "Du bist ein Detektiv, der einen Mord in einem verschneiten Berghotel mit verschlossener Zimmertür aufklären soll.",
    "Du entdeckst in deinem Keller eine geheime Tür, die zu einer Stadt unter deiner eigenen führt.",
    "Du bist der letzte Lehrling eines untergehenden Zauberordens und musst ein gestohlenes Relikt zurückholen, bevor die Welt die Magie für immer vergisst.",
  ],
};

/** Returns the pre-chat welcome text in the adventure's chosen language. */
export function getAdventureIntro(language: Language): string {
  return ADVENTURE_INTRO_BY_LANGUAGE[language];
}

/** Returns opening-line suggestions in the adventure's chosen language. */
export function getStorySuggestions(language: Language): string[] {
  return STORY_SUGGESTIONS_BY_LANGUAGE[language];
}

/** Derives a readable sidebar title from an adventure's opening prompt. */
export function deriveTitle(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return NEW_ADVENTURE_TITLE;
  return trimmed.length > TITLE_MAX_LENGTH
    ? `${trimmed.slice(0, TITLE_MAX_LENGTH)}...`
    : trimmed;
}
