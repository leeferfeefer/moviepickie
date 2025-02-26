import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { IMAGE_URI } from '../services/TMDB.service';

type MovieListItemProps = {
    title: string;
    posterPath?: string;
    onPress: () => void;
};

export const MovieListItem = (props: MovieListItemProps): React.JSX.Element => {
    const { title, onPress, posterPath } = props;
    const [isLoading, setIsLoading] = React.useState(true);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={onPress}
            >

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
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
    },
    button: {
        height: 100,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    text: {
        padding: 10,
        fontSize: 20,
        flex: 1,
    },
    imageContainer: {
        width: 80,
        height: 80,
        marginHorizontal: 10,
    },
    poster: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
        borderRadius: 5,
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -12 }, { translateY: -12 }],
    },
});
