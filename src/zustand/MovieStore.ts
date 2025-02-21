import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandStorage } from '../services/MMKV.service';
import { MovieDetails } from '../types/MovieDetail';

type MovieStore = {
    movies: MovieDetails[];
    addMovie: (movie: MovieDetails) => void;
    removeMovie: (id: number) => void;
    toggleWatch: (id: number) => void;
};

export const useMovieStore = create<MovieStore>()(
    persist(
        (set, get) => ({
            movies: [],
            addMovie: (movie: MovieDetails) => set({ movies: [...get().movies, movie] }),
            removeMovie: (id: number) => set({ movies: get().movies.filter((movie) => movie.id !== id) }),
            toggleWatch: (id: number) => {
                const movies = get().movies.map((movie) => {
                    if (movie.id === id) {
                        return { ...movie, watched: !movie.watched };
                    }
                    return movie;
                });
                set({ movies });
            },
        }),
        {
            name: 'movie-store',
            storage: createJSONStorage(() => zustandStorage),
        }
    )
);