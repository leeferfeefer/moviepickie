import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { IMAGE_URI } from '../services/TMDB.service';

type MovieListItemProps = {
    title: string;
    posterPath?: string;
    onPress: () => void;
};

export const MovieListItem = (props: MovieListItemProps): React.JSX.Element => {
    const { title, onPress, posterPath } = props;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={onPress}
            >
                <Image
                    source={{ uri: `${IMAGE_URI}${posterPath}` }}
                    style={styles.poster}
                />
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
    poster: {
        marginLeft: 10,
        width: 80,
        height: 80,
        resizeMode: 'cover',
        borderRadius: 5,
    },
});
