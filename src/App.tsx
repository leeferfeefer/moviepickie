import React from 'react';
import {
    // SafeAreaView,
    StyleSheet,
    Text
} from 'react-native';
import { Navigation } from './components/BottomTabBar';

const App = (): React.JSX.Element => {
    return (        
        <Navigation/>
    );
}

// <SafeAreaView style={backgroundStyle}>
            //     <StatusBar
            //         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            //         backgroundColor={backgroundStyle.backgroundColor}
            //     />
            // </SafeAreaView>

const styles = StyleSheet.create({});

export default App;
