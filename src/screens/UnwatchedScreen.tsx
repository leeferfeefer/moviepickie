import React from "react";
import { SearchBar } from "../components/SearchBar";
import { MovieList } from "../components/MovieList";
import { MovieListItem } from "../components/MovieListItem";
import { useMovieStore } from "../zustand/MovieStore";
import { useNavigation } from "@react-navigation/native";
import { TabScreens } from "../components/BottomTabBar";

export const UnwatchedScreen = (): React.JSX.Element => {
    const [searchKeyword, setSearchKeyword] = React.useState("");
    const [searchMovieResults, setSearchMovieResults] = React.useState<
        MovieDetails[] | null
    >(null);
    const navigation = useNavigation();

    const movies = useMovieStore(state => state.movies);
    const unwatchedMovies = movies.filter(movie => !movie.watched);

    // make this a hook
    React.useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            if (searchKeyword.length === 0) {
                setSearchMovieResults(null);
            } else {
                setSearchMovieResults(
                    unwatchedMovies.filter(movie =>
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
    }, [searchKeyword, unwatchedMovies]);

    const searchUnwatchedMovies = React.useCallback((searchText: string) => {
        setSearchKeyword(searchText);
    }, []);

    const showMovieDetails = React.useCallback(
        (movie: MovieDetails) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            navigation.navigate("MovieDetail", {
                movieDetails: movie,
                prevRoute: TabScreens.Unwatched,
            });
        },
        [navigation],
    );

    return (
        <>
            <SearchBar
                placeholder="Search unwatched movies"
                onChangeText={searchUnwatchedMovies}
            />
            <MovieList
                data={searchMovieResults ?? unwatchedMovies}
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
