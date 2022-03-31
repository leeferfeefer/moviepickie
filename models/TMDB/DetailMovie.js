/**
 * {
    "adult": false,
    "backdrop_path": "/axg73mVxiZcE9Pzynu2uj1TYIgj.jpg",
    "belongs_to_collection": null,
    "budget": 35000000,
    "genres": [
        {
            "id": 35,
            "name": "Comedy"
        },
        {
            "id": 10402,
            "name": "Music"
        },
        {
            "id": 18,
            "name": "Drama"
        }
    ],
    "homepage": "http://www.walkhard-movie.com/",
    "id": 6575,
    "imdb_id": "tt0841046",
    "original_language": "en",
    "original_title": "Walk Hard: The Dewey Cox Story",
    "overview": "Following a childhood tragedy, Dewey Cox follows a long and winding road to music stardom. Dewey perseveres through changing musical styles, an addiction to nearly every drug known and bouts of uncontrollable rage.",
    "popularity": 16.102,
    "poster_path": "/vqIEXsBPWqkuzwtRLSeSFZGYpjN.jpg",
    "production_companies": [
        {
            "id": 10105,
            "logo_path": "/bN4tiAS8oNlHhIqq66KBPQ1Ekqh.png",
            "name": "Apatow Productions",
            "origin_country": "US"
        },
        {
            "id": 5,
            "logo_path": "/71BqEFAF4V3qjjMPCpLuyJFB9A.png",
            "name": "Columbia Pictures",
            "origin_country": "US"
        }
    ],
    "production_countries": [
        {
            "iso_3166_1": "US",
            "name": "United States of America"
        }
    ],
    "release_date": "2007-12-21",
    "revenue": 18317151,
    "runtime": 96,
    "spoken_languages": [
        {
            "english_name": "English",
            "iso_639_1": "en",
            "name": "English"
        }
    ],
    "status": "Released",
    "tagline": "Life made him tough. Love made him strong. Music made him hard.",
    "title": "Walk Hard: The Dewey Cox Story",
    "video": false,
    "vote_average": 6.6,
    "vote_count": 515
}
 */

const create = (dto) => {
  if (!dto) {
    return;
  }
  return {
    genres: dto.genres?.map(genre => genre?.name)?.join(", "),
    id: dto.id,
    imdbId: dto.imdb_id,
    runtime: dto.runtime,
    tagline: dto.tagline,
  }
};

export default {
  create
};