import React from "react";
import { StyleSheet } from "react-native";
import { SearchBar } from "../components/SearchBar";
import { useNavigation } from "@react-navigation/native";
import { useMovieStore } from "../zustand/MovieStore";
import { MovieListItem } from "../components/MovieListItem";
import { MovieList } from "../components/MovieList";
import { TabScreens } from "../components/BottomTabBar";

export const WatchedScreen = (): React.JSX.Element => {
    const [searchKeyword, setSearchKeyword] = React.useState("");
    const [searchMovieResults, setSearchMovieResults] = React.useState<
        MovieDetails[] | null
    >(null);
    const navigation = useNavigation();

    const movies = useMovieStore(state => state.movies);
    const watchedMovies = movies.filter(movie => movie.watched);

    React.useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            if (searchKeyword.length === 0) {
                setSearchMovieResults(null);
            } else {
                setSearchMovieResults(
                    watchedMovies.filter(movie =>
                        movie.title
                            .toLowerCase()
                            .includes(searchKeyword.toLowerCase()),
                    ),
                );
            }
        }

        return () => {
            isSubscribed = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchKeyword]);

    const searchWatchedMovies = (searchKeyword: string) => {
        setSearchKeyword(searchKeyword);
    };

    const showMovieDetails = React.useCallback(async (movie: MovieDetails) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        navigation.navigate("MovieDetail", {
            movie,
            prevRoute: TabScreens.Watched,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <SearchBar
                placeholder="Search watched movies"
                onChangeText={searchWatchedMovies}
            />
            <MovieList
                data={searchMovieResults ?? watchedMovies}
                renderItem={(movie: MovieDetails) => (
                    <MovieListItem
                        title={movie.title}
                        posterPath={movie.poster_path}
                        onPress={() => showMovieDetails(movie)}
                    />
                )}
            />
        </>
    );
};
