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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchKeyword]);

    const searchUnwatchedMovies = (searchKeyword: string) => {
        setSearchKeyword(searchKeyword);
    };

    const showMovieDetails = React.useCallback(async (movie: MovieDetails) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        navigation.navigate("MovieDetail", {
            movie,
            prevRoute: TabScreens.Unwatched,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
