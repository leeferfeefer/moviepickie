import React from 'react';
// import { useNavigation } from '@react-navigation/native';
import { View, Text } from "react-native";
// import { Button } from '@react-navigation/elements';

export const UnwatchedScreen = (): React.JSX.Element => {
    // const navigation = useNavigation();

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Unwatched Screen</Text>
            {/* <Button onPress={() => navigation.navigate('Unwatched')}>Go to Home</Button> */}
        </View>
    );
};
