import React from 'react';
import Config from "react-native-config";
import axios from "axios";
import type { MovieDetails } from '../types/MovieDetail';
import type { MovieResults, MovieResult } from '../types/MovieResult';
import { Alert } from 'react-native';

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
        api_key: Config.TMDB_API_KEY,
    }
});

export const searchMovies = async (movieName: string): Promise<MovieResults | undefined> => {
    try {
        const response = await tmdbInstance.get("/search/movie", {
            params: {
                language: "en-US",
                query: movieName
            }
        });
        return response.data;
    } catch (error) {
        console.log("Error searching movies: ", error);
        Alert.alert("Error", "Error searching movies");
    }
    return undefined;
};

export const getMovieDetails = async (movieId: MovieResult["id"]): Promise<MovieDetails | undefined> => {
    try {
        const response = await tmdbInstance.get(`/movie/${movieId}`);
        return response.data;
    } catch (error) {
        console.log("Error getting movie detail: ", error);
        Alert.alert("Error", "Error searching movies");
    }
    return undefined;
};
