import React from 'react';
import { Text, StyleSheet, FlatList, ScrollView } from "react-native";
import { SearchBar } from '../components/SearchBar';

export const FindNewScreen = (): React.JSX.Element => {

    const searchNewMovieResults = (searchKeyword: string) => {
        // make api call here
        console.log("searching for: ", searchKeyword);
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
