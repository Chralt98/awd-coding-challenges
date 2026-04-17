export interface Watchable {
  readonly id: string;
  title: string;
  year: string;
}

export interface Film extends Watchable {
  watched: boolean;
  rating?: 1 | 2 | 3 | 4 | 5;
}

export type Playlist = {
  name: string;
  films: Film[];
};
