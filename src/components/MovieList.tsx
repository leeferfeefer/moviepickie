import React from "react";
import { FlatList, StyleSheet, View, Text, RefreshControl } from "react-native";

type MovieListProps<T> = {
    data: T[];
    renderItem: (item: T) => React.JSX.Element;
    loadMoreData?: () => void;
    onRefresh?: () => Promise<void>;
};

export const MovieList = <T extends object>(
    props: MovieListProps<T>,
): React.JSX.Element => {
    const { data, renderItem, loadMoreData, onRefresh } = props;
    const [refreshing, setRefreshing] = React.useState(false);

    const handleRefresh = React.useCallback(async () => {
        if (onRefresh) {
            setRefreshing(true);
            await onRefresh();
            setRefreshing(false);
        }
    }, [onRefresh]);

    const refreshControl = onRefresh ? (
        <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="gray"
        />
    ) : undefined;

    return (
        <>
            {data.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No movies :(</Text>
                </View>
            ) : (
                <FlatList
                    refreshControl={refreshControl}
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
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    emptyText: {
        color: "gray",
        fontSize: 40,
    },
});
