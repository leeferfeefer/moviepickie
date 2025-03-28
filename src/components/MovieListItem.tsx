import React from "react";
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from "react-native";
import { IMAGE_URI } from "../services/TMDB.service";

type MovieListItemProps = {
    title: string;
    posterPath?: string;
    onPress: () => void;
};

export const MovieListItem = React.memo(
    (props: MovieListItemProps): React.JSX.Element => {
        const { title, onPress, posterPath } = props;
        const [isLoading, setIsLoading] = React.useState(true);

        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={onPress}>
                    <View style={styles.imageContainer}>
                        {isLoading && (
                            <ActivityIndicator
                                style={styles.loadingIndicator}
                                size="small"
                                color="#0000ff"
                            />
                        )}
                        <Image
                            source={{ uri: `${IMAGE_URI}${posterPath}` }}
                            style={styles.poster}
                            onLoadStart={() => setIsLoading(true)}
                            onLoadEnd={() => setIsLoading(false)}
                        />
                    </View>
                    <Text style={styles.text}>{title}</Text>
                </TouchableOpacity>
            </View>
        );
    },
);

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        borderColor: "black",
        borderRadius: 5,
        borderWidth: 1,
        flexDirection: "row",
        flex: 1,
        height: 100,
        justifyContent: "center",
    },
    container: {
        flex: 1,
        padding: 10,
    },
    imageContainer: {
        height: 80,
        marginHorizontal: 10,
        width: 80,
    },
    loadingIndicator: {
        left: "50%",
        position: "absolute",
        top: "50%",
        transform: [{ translateX: -12 }, { translateY: -12 }],
    },
    poster: {
        borderRadius: 5,
        height: 80,
        resizeMode: "cover",
        width: 80,
    },
    text: {
        flex: 1,
        fontSize: 20,
        padding: 10,
    },
});
