import React from 'react';
import { FlatList, StyleSheet } from "react-native";

type MovieListProps<T> = {
    data: T[];
    renderItem: (item: T) => React.JSX.Element;
};

export const MovieList = <T extends {}>(props: MovieListProps<T>): React.JSX.Element => {
    const { data, renderItem } = props;

    return (
        <>
            <FlatList
                data={data}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={(_, index) => index.toString()}
            />
        </>
    );
};

const styles = StyleSheet.create({});
