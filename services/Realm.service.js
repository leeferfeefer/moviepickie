import Realm from "realm";
import MPMovie from "../models/MP/Movie";

const MovieSchema = {
  name: "Movie",
  properties: {
    backdropPath: "string",
    id: "int",
    overview: "string",
    posterPath: "string",
    releaseDate: "string",
    title: "string",
    genres: "string",
    runtime: "int",
    imdbId: "string",
    tagline: "string"
  },
  primaryKey: "id",
};

// export function getRealmApp() {
//   const appId = "";
//   const appConfig = {
//     id: appId,
//     timeout: 10000,
//   };
//   return new Realm.App(appConfig);
// }

let realm;
const openRealm = async () => {
  if (!realm) {
    try {
      realm = await Realm.open({ schema: [MovieSchema] });
      console.log("realm path: ", realm.path);
    } catch (error) {
      console.log("Could not open realm: ", error);
    }
  } else {
    console.log("Realm already open!");
  }
};

const closeRealm = () => {
  if (realm) {
    realm.close();
    realm = null;
  } else {
    console.log("Realm is not open!");
  }
};

const addMovie = async (movie, details) => {
  let isSuccess = false;
  try {
    if (realm) {
      realm.write(() => {
        realm.create("Movie", { ...movie, ...details });
      });
      isSuccess = true;
    } else {
      console.log("Realm is not open when attempting to add movie!");
    }
  } catch (error) {
    console.log("Could not add movie: ", error);
  } finally {
    return isSuccess;
  }
};

const removeMovie = async (movieId) => {
  let isSuccess = false;
  try {
    if (realm) {      
      const movieToRemove = await findMovie(movieId);
      realm.write(() => {
        realm.delete(movieToRemove);
      });
      isSuccess = true;
    } else {
      console.log("Realm is not open when attempting to delete movie!");
    }
  } catch (error) {
    console.log("Could not remove movie: ", error);
  } finally {
    return isSuccess;
  }
};

const getMovies = async () => {
  let movies;
  try {
    if (realm) {
      movies = realm.objects("Movie");
    } else {
      console.log("Realm is not open when attempting to get movies!");
    }
  } catch (error) {
    console.log("Could not get movies: ", error);
  } finally {
    return movies?.map(MPMovie.create);
  }
};

const findMovie = async (movieId, convert = false) => {
  let movie;
  try {
    if (realm) {
      const movies = realm.objects("Movie");
      movie = movies.filtered(`id = '${movieId}'`)?.[0];
    } else {
      console.log("Realm is not open when attempting to find movie!");
    }  
  } catch (error) {
    console.log("Could not find movie: ", error);
  } finally {
    return convert ? MPMovie.create(movie) : movie;
  }
};

export default {
  openRealm,
  closeRealm,
  addMovie,
  removeMovie,
  getMovies,
  findMovie
};