import React from 'react';
import { Text, StyleSheet, FlatList, ScrollView } from "react-native";
import { SearchBar } from '../components/SearchBar';
import { searchMovies, type MovieResults } from '../services/TMDB.service';

export const FindNewScreen = (): React.JSX.Element => {
    const [ movieResults, setMovieResults ] = React.useState<MovieResults>();

    const searchNewMovieResults = async (searchKeyword: string) => {
        console.log("searching for: ", searchKeyword);
        const results = await searchMovies(searchKeyword);
        if (results) {
            setMovieResults(results);
        }
    };

    return (
        <>
            <SearchBar
                placeholder="Search for new movie"
                onEnterPress={searchNewMovieResults}
            />
            <FlatList
                data={new Array(100).fill(0)}
                renderItem={() => <Text>Movie</Text>}
                keyExtractor={(item, index) => index.toString()}

            />
        </>
    );
};

const styles = StyleSheet.create({});
