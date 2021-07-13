import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

const App = () => {

    const readMoviesButtonPressed = () => {
        console.log("Button pressed...");
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle='light-content' />
            <View style={styles.view}>
                <TouchableHighlight style={styles.readMoviesListButton} onPress={readMoviesButtonPressed}>
                    <Text style={styles.readMoviesListButtonText}>Read Movies</Text>
                </TouchableHighlight>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    view: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    readMoviesListButton: {
        backgroundColor: 'blue',
        height: 50,
        width: 100,
        justifyContent: 'space-around'
    },
    readMoviesListButtonText: {
        color: 'white',
        textAlign: 'center'
    }
});

export default App;
