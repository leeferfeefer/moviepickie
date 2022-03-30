import React from 'react';
import Config from "react-native-config";
import axios from "axios";
import SearchMovie from '../models/TMDB/SearchMovie';
import DetailMovie from '../models/TMDB/DetailMovie';

// axios.interceptors.request.use(request => {
//   console.log('Starting Request', JSON.stringify(request));
//   return request;
// });

// axios.interceptors.response.use(response => {
//   console.log('Response:', JSON.stringify(response));
//   return response;
// });

const IMAGE_URI = "https://image.tmdb.org/t/p/original";

const tmdbInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 5000,
  params: {
    api_key: Config.TMDB_KEY,
  }
});

const searchMovies = async (movieName) => {
  let result = [];
  try {
    const response = await tmdbInstance.get("/search/movie", {
      params: {
        language: "en-US",
        query: movieName
      }
    });
    result = response.data?.results?.map(SearchMovie.create);
  } catch (error) {
    console.log("Error searching movies: ", error);
  }
  return result;
};

const getMovieDetails = async (tmdbid) => {
  let result = {};
  try {
    const response = await tmdbInstance.get(`/movie/${tmdbid}`);
    result = DetailMovie.create(response.data);
  } catch (error) {
    console.log("Error searching movies: ", error);
  }
  return result;
};

export default {
  searchMovies,
  getMovieDetails,
  IMAGE_URI
}