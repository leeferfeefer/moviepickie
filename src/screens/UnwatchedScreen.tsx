import React from 'react';
import { StyleSheet } from "react-native";
import { SearchBar } from '../components/SearchBar';
import { MovieDetails } from '../types/MovieDetail';
import { MovieList } from '../components/MovieList';
import { MovieListItem } from '../components/MovieListItem';
import { useMovieStore } from '../zustand/MovieStore';

export const UnwatchedScreen = (): React.JSX.Element => {
    const movies = useMovieStore((state) => state.movies);

    const searchUnwatchedMovies = (searchKeyword: string) => {
        // filter out movies here
        console.log("searching for: ", searchKeyword);
    };

    return (
        <>
            <SearchBar
                placeholder="Search unwatched movies"
                onChangeText={searchUnwatchedMovies}
            />
            <MovieList
                data={movies}
                renderItem={(movie: MovieDetails) => (
                    <MovieListItem
                        title={movie.title}
                        posterPath={movie.poster_path}
                        onPress={() => {}}
                    />
                )}
            />
        </>
    );
};

const styles = StyleSheet.create({});