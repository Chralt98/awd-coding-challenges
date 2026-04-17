import { Film } from "../film-watchlist-types.js";
import type { Playlist, Watchable } from "../film-watchlist-types.js";

function formatFilm(film: Film): string {
  return `The film has ${film.watched ? "" : "not"} been watched. ${film.rating ? "Its rating is " + film.rating + "." : ""}`;
}

function getUnwatched(playlist: Playlist): Film[] {
  return playlist.films.filter((f) => !f.watched);
}

let film1: Film = {
  id: "ID-1",
  title: "Harry Potter",
  year: "2001",
  watched: false,
};

let watchable2: Watchable = {
  id: "ID-2",
  title: "The Big Short",
  year: "2016",
};

let film2: Film = {
  ...watchable2,
  watched: true,
  rating: 2,
};

let film3: Film = {
  id: "ID-3",
  title: "The Hobbit",
  year: "1977",
  watched: true,
  rating: 5,
};
let playlist: Playlist = {
  name: "My cool playlist",
  films: [film1, film2, film3],
};

console.log(formatFilm(film2));
console.log(getUnwatched(playlist));
