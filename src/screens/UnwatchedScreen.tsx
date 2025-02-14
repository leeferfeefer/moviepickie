import React from 'react';
import { StyleSheet } from "react-native";
import { SearchBar } from '../components/SearchBar';
import { MovieDetails } from '../types/MovieDetail';
import { MovieList } from '../components/MovieList';
import { MovieListItem } from '../components/MovieListItem';
import { useMovieStore } from '../zustand/MovieStore';

export const UnwatchedScreen = (): React.JSX.Element => {
    const movies = useMovieStore((state) => state.movies);
    const [searchKeyword, setSearchKeyword] = React.useState("");
    const [searchMovieResults, setSearchMovieResults] = React.useState<MovieDetails[] | null>(null);

    const searchUnwatchedMovies = (searchKeyword: string) => {
        setSearchKeyword(searchKeyword);
    };

    React.useEffect(() => {
        if (searchKeyword.length === 0) {
            setSearchMovieResults(null);
        } else {
            setSearchMovieResults(movies.filter((movie) => movie.title.toLowerCase().includes(searchKeyword.toLowerCase())));
        }

        const results = movies.filter((movie) => movie.title.toLowerCase().includes(searchKeyword.toLowerCase()));
        setSearchMovieResults(results);
    }, [searchKeyword]);

    return (
        <>
            <SearchBar
                placeholder="Search unwatched movies"
                onChangeText={searchUnwatchedMovies}
            />
            <MovieList
                data={searchMovieResults ?? movies}
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