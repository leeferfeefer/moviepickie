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

export const IMAGE_URI = "https://image.tmdb.org/t/p/original";

const tmdbInstance = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    timeout: 5000,
    params: {
        api_key: Config.TMDB_API_KEY,
    }
});

export const searchMovies = async (movieName: string, page: number = 1): Promise<MovieResults | undefined> => {
    try {
        const response = await tmdbInstance.get("/search/movie", {
            params: {
                language: "en-US",
                query: movieName,
                page
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
        Alert.alert("Error", "Error getting movie details");
    }
    return undefined;
};

export const getMovieTrailerKeys = async (movieId: MovieResult["id"]): Promise<string[] | undefined> => {
    try {
        const response = await tmdbInstance.get(`/movie/${movieId}/videos`);
        const data = response.data;
        const trailers: MovieTrailerResult[] = data.results.filter((result: MovieTrailerResult) => result.type === "Trailer" && result.official && result.site === "YouTube");
        return trailers.map(trailer => trailer.key);
    } catch (error) {
        console.log("Error getting movie trailer information: ", error);
        Alert.alert("Error", "Error getting movie trailers");
    }
    return undefined;
}

export const getNowPlaying = async (): Promise<MovieResults | undefined> => {
    try {
        const response = await tmdbInstance.get(`/movie/now_playing`);
        return response.data;
    } catch (error) {
        console.log("Error getting now playing information: ", error);
        Alert.alert("Error", "Error getting now playing movies");
    }
    return undefined;
};

export const getPopular = async (): Promise<MovieResults | undefined> => {
    try {
        const response = await tmdbInstance.get(`/movie/popular`);
        return response.data;
    } catch (error) {
        console.log("Error getting popular information: ", error);
        Alert.alert("Error", "Error getting popular movies");
    }
    return undefined;
};

export const getTopRated = async (): Promise<MovieResults | undefined> => {
    try {
        const response = await tmdbInstance.get(`/movie/top_rated`);
        return response.data;
    } catch (error) {
        console.log("Error getting top rated information: ", error);
        Alert.alert("Error", "Error getting top rated movies");
    }
    return undefined;
};

export const getUpcoming = async (): Promise<MovieResults | undefined> => {
    try {
        const response = await tmdbInstance.get(`/movie/upcoming`);
        return response.data;
    } catch (error) {
        console.log("Error getting upcoming information: ", error);
        Alert.alert("Error", "Error getting upcoming movies");
    }
    return undefined;
};