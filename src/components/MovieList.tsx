import React from 'react';
import { FlatList, StyleSheet, View, Text } from "react-native";

type MovieListProps<T> = {
    data: T[];
    renderItem: (item: T) => React.JSX.Element;
    loadMoreData?: () => void;
};

export const MovieList = <T extends {}>(props: MovieListProps<T>): React.JSX.Element => {
    const { data, renderItem, loadMoreData } = props;

    return (
        <>
            {data.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No movies :(</Text>
                </View>
            ) : (
                <FlatList
                    data={data}
                    renderItem={({ item }) => renderItem(item)}
                    keyExtractor={(_, index) => index.toString()}
                    onEndReached={loadMoreData}
                    onEndReachedThreshold={0.1}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        fontSize: 40,
        color: 'gray',
    }
});
