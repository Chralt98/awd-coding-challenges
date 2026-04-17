type TrackId = number;
type ArtistName = string;

export interface Media {
  id: TrackId;
  title: string;
}
export interface Track extends Media {
  artist: ArtistName;
  liked: boolean;
}
export interface FeaturedTrack extends Track {
  curatedBy: string;
  readonly addedDate: string;
}

export function formatId(id: TrackId): string {
  return `TRK-${id}`;
}
