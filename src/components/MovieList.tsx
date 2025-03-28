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
    React.forwardRef(
        <T extends object>(
            props: MovieListProps<T>,
            ref: React.Ref<FlatList<T>>,
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

            const onEndReached = React.useCallback(
                ({ distanceFromEnd }: { distanceFromEnd: number }) => {
                    if (distanceFromEnd < 100) {
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

            // Make use of ListEmptyComponent - instead of a separate condition...
            // Make use of ListHeaderComponent - searching & segmented control...
            // Consider rendering movies horizontally?

            return (
                <>
                    {data.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No movies :(</Text>
                        </View>
                    ) : (
                        <FlatList
                            ref={ref}
                            refreshControl={refreshControl}
                            data={data}
                            renderItem={({ item }) => renderItem(item)}
                            keyExtractor={(_, index) => index.toString()}
                            onEndReached={onEndReached}
                        />
                    )}
                </>
            );
        },
    ),
) as <T extends object>(
    props: MovieListProps<T> & { ref?: React.Ref<FlatList<T>> },
) => React.JSX.Element;

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
