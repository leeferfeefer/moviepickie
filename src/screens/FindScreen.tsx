import React from 'react';
import { StyleSheet, View } from "react-native";
import { SearchBar } from '../components/SearchBar';
import { searchMovies, getMovieDetails } from '../services/TMDB.service';
import { MovieList } from '../components/MovieList';
import { MovieListItem } from '../components/MovieListItem';
import { LoadingIndicator } from '../components/FullScreenLoader';
import type { MovieResult } from '../types/MovieResult';
import { useNavigation } from '@react-navigation/native';
import { TabScreens } from "../components/BottomTabBar";

export const FindScreen = (): React.JSX.Element => {
    const [movieResults, setMovieResults] = React.useState<MovieResult[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const prevSearchKeyword = React.useRef<string>("");
    const navigation = useNavigation();

    const searchNewMovieResults = React.useCallback(async (searchKeyword: string) => {
        if (searchKeyword !== prevSearchKeyword.current) {
            setIsLoading(true);
            const movieResults = await searchMovies(searchKeyword);
            if (movieResults) {
                setMovieResults(movieResults.results);
                prevSearchKeyword.current = searchKeyword;
            }
            setIsLoading(false);
        }
    }, []);

    const showMovieDetails = React.useCallback(async (movieId: MovieResult["id"]) => {
        setIsLoading(true);
        const movieDetails = await getMovieDetails(movieId);
        setIsLoading(false);
        if (movieDetails) {
            // @ts-ignore
            navigation.navigate('Detail', { movie: movieDetails, prevRoute: TabScreens.FindNewMovie });
        }    
    }, []);

    return (
        <View style={styles.container}>
            <SearchBar
                placeholder="Search for new movie"
                onEnterPress={searchNewMovieResults}
            />
            <MovieList
                data={movieResults}
                renderItem={(movieResult: MovieResult) => (
                    <MovieListItem
                        title={movieResult.title}
                        posterPath={movieResult.poster_path}
                        onPress={() => showMovieDetails(movieResult.id)}
                    />
                )}
            />
            {isLoading && <LoadingIndicator />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
