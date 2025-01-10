import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";

type MovieListItemProps = {
    title: string;
    onPress: () => void;
};

export const MovieListItem = (props: MovieListItemProps): React.JSX.Element => {
    const { title , onPress} = props;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={onPress}
            >
                <Text style={styles.text}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    button: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
    },
    text: {
        padding: 10,
        fontSize: 20
    }
});
