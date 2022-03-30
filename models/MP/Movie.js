
/**
 * Convert Realm movie to MoviePickie movie
 */

// const MovieSchema = {
//   name: "Movie",
//   properties: {
//     backdropPath: "string",
//     id: "int",
//     overview: "string",
//     popularity: "int",
//     posterPath: "string",
//     releaseDate: "string",
//     title: "string",
//     voteAvg: "int",
//     voteCount: "int",
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
    popularity: realmObject.popularity,
    posterPath: realmObject.posterPath,
    releaseDate: realmObject.releaseDate,
    title: realmObject.title,
    voteAvg: realmObject.voteAvg,
    voteCount: realmObject.voteCount,
  }
};

export default {
  create
};