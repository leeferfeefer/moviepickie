import React from "react";
import { StyleSheet, View } from "react-native";
import { SearchBar } from "../components/SearchBar";
import { searchMovies, getMovieDetails } from "../services/TMDB.service";
import { MovieList } from "../components/MovieList";
import { MovieListItem } from "../components/MovieListItem";
import { LoadingIndicator } from "../components/FullScreenLoader";
import { useNavigation } from "@react-navigation/native";
import { TabScreens } from "../components/BottomTabBar";

export const FindScreen = (): React.JSX.Element => {
    const navigation = useNavigation();
    const [movieResults, setMovieResults] = React.useState<MovieResult[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const prevSearchKeyword = React.useRef<string>("");

    const getMovies = async (searchKeyword: string, page: number) => {
        setIsLoading(true);
        const movies = await searchMovies(searchKeyword, page);
        if (movies) {
            setMovieResults(prevMovieResults => [
                ...prevMovieResults,
                ...movies.results,
            ]);
            prevSearchKeyword.current = searchKeyword;
        }
        setIsLoading(false);
    };

    const searchNewMovieResults = React.useCallback(
        async (searchKeyword: string) => {
            if (searchKeyword !== prevSearchKeyword.current) {
                getMovies(searchKeyword, currentPage);
            }
        },
        [currentPage],
    );

    const showMovieDetails = React.useCallback(
        async (movieId: MovieResult["id"]) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            navigation.navigate("MovieDetail", {
                movieId,
                prevRoute: TabScreens.Find,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const loadMoreData = React.useCallback(() => {
        setCurrentPage(prevPage => prevPage + 1);
        getMovies(prevSearchKeyword.current, currentPage);
    }, [currentPage]);

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
                loadMoreData={loadMoreData}
            />
            {isLoading && <LoadingIndicator />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
