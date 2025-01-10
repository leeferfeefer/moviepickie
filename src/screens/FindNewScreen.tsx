import React from 'react';
import { StyleSheet } from "react-native";
import { SearchBar } from '../components/SearchBar';
import { searchMovies, type MovieResult } from '../services/TMDB.service';
import { MovieList } from '../components/MovieList';
import { MovieListItem } from '../components/MovieListItem';

export const FindNewScreen = (): React.JSX.Element => {
    const [movieResults, setMovieResults] = React.useState<MovieResult[]>([]);

    const searchNewMovieResults = async (searchKeyword: string) => {
        console.log("searching for: ", searchKeyword);
        const movieResults = await searchMovies(searchKeyword);
        if (movieResults) {
            setMovieResults(movieResults.results);
        }
    };

    return (
        <>
            <SearchBar
                placeholder="Search for new movie"
                onEnterPress={searchNewMovieResults}
            />
            <MovieList
                data={movieResults}
                renderItem={(movieResult: MovieResult) => (
                    <MovieListItem title={movieResult.title} />
                )}
            />
        </>
    );
};

const styles = StyleSheet.create({});
