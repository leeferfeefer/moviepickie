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

const closeRealm = async () => {
  if (realm) {
    realm.close();
  } else {
    console.log("Realm is not open!");
  }
};

const addMovie = async (movieName) => {
  let isSuccess = false;
  try {
    if (realm) {
      realm.write(() => {
        realm.create("Movie", { movie_name: movieName, _id: new BSON.ObjectID() });
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

const removeMovie = async (movieName) => {
  let realm;
  let isSuccess = false;
  try {
    if (realm) {
      const movieToRemove = await findMovie(movieName);
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
    return movies;
  }
};

const findMovie = async (movieName) => {
  let movie;
  try {
    if (realm) {
      const movies = await getMovies();
      movie = movies.filtered(`movie_name = '${movieName}'`)?.[0];
    } else {
      console.log("Realm is not open when attempting to find movie!");
    }  
  } catch (error) {
    console.log("Could not find movie: ", error);
  } finally {
    return movie;
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