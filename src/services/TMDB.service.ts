import Config from "react-native-config";
import axios from "axios";
import { logError } from "./Error.service";

export const IMAGE_URI = "https://image.tmdb.org/t/p/original";

// Movie ID: 817

const tmdbInstance = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    timeout: 15000, // Looks like this doesnt work on android? Use timeout and cancel or abort controller as workaround?
    params: {
        api_key: Config.TMDB_API_KEY,
    },
});

export const searchMovies = async (
    movieName: MovieResult["title"],
    page: number = 1,
): Promise<MovieResults | undefined> => {
    try {
        const response = await tmdbInstance.get("/search/movie", {
            params: {
                language: "en-US",
                query: movieName,
                page,
            },
        });
        return response.data;
    } catch (error) {
        logError("Error searching movies", error);
    }
    return undefined;
};

export const getMovieDetails = async (
    movieId: MovieResult["id"],
): Promise<MovieDetails | undefined> => {
    try {
        const response = await tmdbInstance.get(`/movie/${movieId}`);
        return response.data;
    } catch (error) {
        logError("Error getting movie details information", error);
    }
    return undefined;
};

export const getMovieTrailerKeys = async (
    movieId: MovieResult["id"],
): Promise<string[] | undefined> => {
    try {
        const response = await tmdbInstance.get(`/movie/${movieId}/videos`);
        const data = response.data;
        const trailers: MovieTrailerResult[] = data.results.filter(
            (result: MovieTrailerResult) =>
                result.type === "Trailer" &&
                result.official &&
                result.site === "YouTube",
        );
        return trailers.map(trailer => trailer.key);
    } catch (error) {
        logError("Error getting movie trailer information", error);
    }
    return undefined;
};

export const getNowPlaying = async (
    page: number,
): Promise<MovieResults | undefined> => {
    try {
        const response = await tmdbInstance.get(`/movie/now_playing`, {
            params: {
                language: "en-US",
                page,
            },
        });
        return response.data;
    } catch (error) {
        logError("Error getting now playing information", error);
    }
    return undefined;
};

export const getPopular = async (
    page: number,
): Promise<MovieResults | undefined> => {
    try {
        const response = await tmdbInstance.get(`/movie/popular`, {
            params: {
                language: "en-US",
                page,
            },
        });
        return response.data;
    } catch (error) {
        logError("Error getting popular information", error);
    }
    return undefined;
};

export const getTopRated = async (
    page: number,
): Promise<MovieResults | undefined> => {
    try {
        const response = await tmdbInstance.get(`/movie/top_rated`, {
            params: {
                language: "en-US",
                page,
            },
        });
        return response.data;
    } catch (error) {
        logError("Error getting top rated information", error);
    }
    return undefined;
};

export const getUpcoming = async (
    page: number,
): Promise<MovieResults | undefined> => {
    try {
        const response = await tmdbInstance.get(`/movie/upcoming`, {
            params: {
                language: "en-US",
                page,
            },
        });
        return response.data;
    } catch (error) {
        logError("Error getting upcoming information", error);
    }
    return undefined;
};

export const getMovieCredits = async (
    movieId: MovieResult["id"],
): Promise<MovieCredits | undefined> => {
    try {
        const response = await tmdbInstance.get(`/movie/${movieId}/credits`, {
            params: {
                language: "en-US",
            },
        });
        return response.data;
    } catch (error) {
        logError("Error getting movie credits information", error);
    }
    return undefined;
};

export const getActorDetails = async (
    actorId: ActorCast["id"],
): Promise<ActorDetails | undefined> => {
    try {
        const response = await tmdbInstance.get(`/person/${actorId}`, {
            params: {
                language: "en-US",
            },
        });
        return response.data;
    } catch (error) {
        logError("Error getting actor details information", error);
    }
    return undefined;
};

export const getActorCredits = async (
    actorId: ActorCast["id"],
): Promise<ActorCredits | undefined> => {
    try {
        const response = await tmdbInstance.get(`/person/${actorId}/movie_credits`, {
            params: {
                language: "en-US",
            },
        });
        return response.data;
    } catch (error) {
        logError("Error getting actor credits information", error);
    }
    return undefined;
};

// Provided by JustWatch
export const getWatchProviders = async (
    movieId: MovieDetails["id"],
): Promise<Providers | undefined> => {
    try {
        const response = await tmdbInstance.get(`/movie/${movieId}/watch/providers`);
        const data = response.data as WatchProvidersResult;
        return data.results.US;
    } catch (error) {
        logError("Error getting watch providers information", error);
    }
    return undefined;
};
