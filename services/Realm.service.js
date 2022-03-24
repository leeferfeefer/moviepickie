import "react-native-get-random-values";
import BSON from "bson";
import Realm from "realm";

const MovieSchema = {
  name: "Movie",
  properties: {
    _id: "objectId",
    movie_name: "string"
  },
  primaryKey: "_id",
};

// export function getRealmApp() {
//   const appId = "";
//   const appConfig = {
//     id: appId,
//     timeout: 10000,
//   };
//   return new Realm.App(appConfig);
// }

const _openRealm = async () => {
  let realm;
  try {
    realm = await Realm.open({ schema: [MovieSchema] });
    console.log("realm path: ", realm.path);
  } catch (error) {
    console.log("Could not open realm: ", error);
  }
  return realm;
};

const addMovie = async (movieName) => {
  let realm;
  let isSuccess = false;
  try {
    realm = await _openRealm();
    if (realm) {
      realm.write(() => {
        realm.create("Movie", { movie_name: movieName, _id: new BSON.ObjectID() });
      });
      isSuccess = true;
    }
  } catch (error) {
    console.log("Could not add movie: ", error);
  } finally {
    realm?.close();
    return isSuccess;
  }
};

const removeMovie = async (movieName) => {
  let realm;
  let isSuccess = false;
  try {
    realm = await _openRealm();
    const movieToRemove = await findMovie(movieName);
    realm.write(() => {
      realm.delete(movieToRemove);
    });
    isSuccess = true;
  } catch (error) {
    console.log("Could not remove movie: ", error);
  } finally {
    realm?.close();
    return isSuccess;
  }
};

const findMovie = async (movieName) => {
  let movie;
  try {
    const movies = await getMovies();
    movie = movies.filtered(`movie_name = '${movieName}'`)?.[0];
  } catch (error) {
    console.log("Could not find movie: ", error);
  } finally {
    return movie;
  }
};

const getMovies = async () => {
  let movies;
  let realm;
  try {
    realm = await _openRealm();
    if (realm) {
      movies = realm.objects("Movie");
      console.log("returned movies:", movies);
    }
  } catch (error) {
    console.log("Could not get movies: ", error);
  } finally {
    realm?.close();
    return movies;
  }
};


export default {
  addMovie,
  removeMovie,
  getMovies,
  findMovie
};