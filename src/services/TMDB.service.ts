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

const IMAGE_URI = "https://image.tmdb.org/t/p/original";

const tmdbInstance = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    timeout: 5000,
    params: {
        api_key: Config.TMDB_API_KEY,
    }
});

export type MovieResult = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: any[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: Date;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export type MovieResults = {
    page: number;
    results: MovieResult[];
    total_pages: number;
    total_results: number;
}

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
    }
    return undefined;
};

// const getMovieDetails = async (tmdbid) => {
//     let result = {};
//     try {
//         const response = await tmdbInstance.get(`/movie/${tmdbid}`);
//         result = DetailMovie.create(response.data);
//     } catch (error) {
//         console.log("Error searching movies: ", error);
//     }
//     return result;
// };
