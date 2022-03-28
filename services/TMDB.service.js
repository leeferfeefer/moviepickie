import React from 'react';
import Config from "react-native-config";
import axios from "axios";

// axios.interceptors.request.use(request => {
//   console.log('Starting Request', JSON.stringify(request));
//   return request;
// });

// axios.interceptors.response.use(response => {
//   console.log('Response:', JSON.stringify(response));
//   return response;
// });

const queryMovieInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3/search/movie",
  timeout: 5000
});

const searchMovies = async (movieName) => {
  let result = [];
  try {
    const response = await queryMovieInstance.get("", {
      params: {
        api_key: Config.TMDB_KEY,
        language: "en-US",
        query: movieName
      }
    });
    result = response.data?.results;
  } catch (error) {
    console.log("Error searching movies: ", error);
  }
  return result;
};

export default {
  searchMovies,
}