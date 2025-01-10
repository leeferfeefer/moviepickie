import React from 'react';
import { StyleSheet, View } from "react-native";
import { SearchBar } from '../components/SearchBar';
import { searchMovies } from '../services/TMDB.service';
import { MovieList } from '../components/MovieList';
import { MovieListItem } from '../components/MovieListItem';
import { LoadingIndicator } from '../components/LoadingIndicator';
import type { MovieResult } from '../types/MovieResult';

export const FindNewScreen = (): React.JSX.Element => {
    const [movieResults, setMovieResults] = React.useState<MovieResult[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const prevSearchKeyword = React.useRef<string>("");

    const searchNewMovieResults = async (searchKeyword: string) => {
        if (searchKeyword !== prevSearchKeyword.current) {
            console.log("searching for: ", searchKeyword);
            setIsLoading(true);
            const movieResults = await searchMovies(searchKeyword);
            if (movieResults) {
                setMovieResults(movieResults.results);
                setIsLoading(false);
                prevSearchKeyword.current = searchKeyword;
            }
        }
    };

    return (
        <View style={styles.container}>
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
            {isLoading && <LoadingIndicator />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
    }
});
