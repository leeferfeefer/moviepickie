import React from 'react';
import { Text, StyleSheet } from "react-native";

type MovieListItemProps = {
    title: string;
};

export const MovieListItem = (props: MovieListItemProps): React.JSX.Element => {
    const { title } = props;

    return (
        <>
            <Text>
                {title}
            </Text>
        </>
    );
};

const styles = StyleSheet.create({});
