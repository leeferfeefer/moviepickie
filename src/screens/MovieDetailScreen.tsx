import React from "react";
import { Text, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';

export type MovieDetailScreenProps = {

    route: any;
};

export const MovieDetailScreen = (props: MovieDetailScreenProps): React.JSX.Element => {
    const { route } = props;
    const navigation = useNavigation();

    React.useEffect(() => {
        navigation.setOptions({
            headerTitle: route.params.title,
        });
    }, []);

    return (
        <Text>Detail Screen</Text>
    );
}

const styles = StyleSheet.create({

});
