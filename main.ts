import { formatId } from "./types.js";
import type { Track, FeaturedTrack } from "./types.js";

const libraryName = "Late Night Listening";

function describeTrack(title: string, artist: string): string {
  return `${title} by ${artist}`;
}

const tracks: Track[] = [
  { id: 1, title: "Blue Light", artist: "Jorja Smith", liked: true },
  { id: 2, title: "Nights", artist: "Frank Ocean", liked: false },
];

const label = "My Library";
const trackCount = tracks.length;

const ids = tracks.map((t) => formatId(t.id));
console.log(ids, label, trackCount);

const pick: FeaturedTrack = {
  id: 3,
  title: "Golden",
  artist: "Jill Scott",
  liked: true,
  curatedBy: "editorial",
  addedDate: "2024-01-15",
};

// pick.addedDate = "2026"; // Disallowed, 'addedDate' is readonly
pick.liked = false; // Allowed, 'liked' is not readonly

console.log(`${pick.title} — featured since ${pick.addedDate}`);

console.log("Features pick:", pick);

console.log(`Library: ${libraryName}`);
console.log(describeTrack(tracks[0].artist, tracks[0].title));
tracks.forEach((t) => console.log(formatId(t.id)));
console.log(`Featured: ${pick.title} — added ${pick.addedDate}`);
