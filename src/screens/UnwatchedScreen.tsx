import React from 'react';
import { Text, StyleSheet, FlatList } from "react-native";
import { SearchBar } from '../components/SearchBar';

export const UnwatchedScreen = (): React.JSX.Element => {

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
            <FlatList
                data={new Array(100).fill(0)}
                renderItem={() => <Text>Movie</Text>}
                keyExtractor={(item, index) => index.toString()}

            />
        </>
    );
};

const styles = StyleSheet.create({});