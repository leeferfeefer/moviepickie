// "adult": false,
// "backdrop_path": "/isrro0soStk2tSWMsI50lPPhUsU.jpg",
// "genre_ids": [
//     80,
//     18,
//     9648,
//     53
// ],
// "id": 169917,
// "original_language": "en",
// "original_title": "A Walk Among the Tombstones",
// "overview": "Private investigator Matthew Scudder is hired by a drug kingpin to find out who kidnapped and murdered his wife.",
// "popularity": 82.768,
// "poster_path": "/bQTHTZezSudf27mMQtedHf1XpgO.jpg",
// "release_date": "2014-09-19",
// "title": "A Walk Among the Tombstones",
// "video": false,
// "vote_average": 6.3,
// "vote_count": 2360


const create = (dto) => {
  if (!dto) {
    return;
  }
  return {
    // isAdult: dto.adult,
    backdropPath: dto.backdrop_path,
    // genres: dto.genre_ids,
    id: dto.id,
    // originalTitle: dto.original_title,
    overview: dto.overview,
    popularity: dto.popularity,
    posterPath: dto.poster_path,
    releaseDate: dto.release_date,
    title: dto.title,
    voteAvg: dto.vote_average,
    voteCount: dto.vote_count
  }
};

export default {
  create
};