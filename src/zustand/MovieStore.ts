import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandStorage } from '../services/MMKV.service';
import { MovieDetails } from '../types/MovieDetail';

type MovieStore = {
    movies: MovieDetails[];
    addMovie: (movie: MovieDetails) => void;
    removeMovie: (id: number) => void;
};

export const useMovieStore = create<MovieStore>()(
    persist(
        (set, get) => ({
            movies: [],
            addMovie: (movie: MovieDetails) => set({ movies: [...get().movies, movie] }),
            removeMovie: (id: number) => set({ movies: get().movies.filter((movie) => movie.id !== id) }),
        }),
        {
            name: 'movie-store',
            storage: createJSONStorage(() => zustandStorage),
        }
    )
);