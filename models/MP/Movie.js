
/**
 * Convert Realm movie to MoviePickie movie
 */

//  const MovieSchema = {
//   name: "Movie",
//   properties: {
//     backdropPath: "string",
//     id: "int",
//     overview: "string",
//     posterPath: "string",
//     releaseDate: "string",
//     title: "string",
//     genres: "string",
//     runtime: "int",
//     imdbId: "string",
//     tagline: "string"
//   },
//   primaryKey: "id",
// };


const create = (realmObject) => {
  if (!realmObject) {
    return;
  }
  return {
    backdropPath: realmObject.backdropPath,
    id: realmObject.id,
    overview: realmObject.overview,
    posterPath: realmObject.posterPath,
    releaseDate: realmObject.releaseDate,
    title: realmObject.title,
    genres: realmObject.genres,
    runtime: realmObject.runtime,
    imdbId: realmObject.imdbId,
    tagline: realmObject.tagline,
  }
};

export default {
  create
};