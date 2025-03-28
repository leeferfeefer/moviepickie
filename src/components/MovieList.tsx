import React from "react";
import {
    FlatList,
    StyleSheet,
    View,
    Text,
    RefreshControl,
    FlatListProps,
} from "react-native";

export type MovieListProps<T> = {
    data: T[];
    renderItem: (item: T) => React.JSX.Element;
    loadMoreData?: () => void;
} & Pick<FlatListProps<T>, "onRefresh">;

export const MovieList = React.memo(
    <T extends object>(props: MovieListProps<T>): React.JSX.Element => {
        const { data, renderItem, loadMoreData, onRefresh } = props;
        const [refreshing, setRefreshing] = React.useState(false);

        const handleRefresh = React.useCallback(async () => {
            if (onRefresh) {
                setRefreshing(true);
                await onRefresh();
                setRefreshing(false);
            }
        }, [onRefresh]);

        const onEndReached = React.useCallback(
            ({ distanceFromEnd }: { distanceFromEnd: number }) => {
                if (distanceFromEnd < 100) {
                    console.log("threshold reached, loading more data");
                    loadMoreData?.();
                }
            },
            [loadMoreData],
        );

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
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.1}
                    />
                )}
            </>
        );
    },
) as <T extends object>(props: MovieListProps<T>) => React.JSX.Element;

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
