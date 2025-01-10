import Icon from '@react-native-vector-icons/ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UnwatchedScreen } from '../screens/UnwatchedScreen';
import { WatchedScreen } from '../screens/WatchedScreen';
import { FindNewScreen } from '../screens/FindNewScreen';
import { createStaticNavigation } from '@react-navigation/native';

enum TabScreens {
    Unwatched = 'Unwatched',
    Watched = 'Watched',
    FindNewMovie = 'Find New Movie',
}

const TabBar = createBottomTabNavigator({
    screenOptions: ({ route }) => ({
        tabBarIcon: ({ color, size }) => {
            let iconName: any;
            if (route.name === TabScreens.Unwatched) {
                iconName = 'eye-off-outline';
            } else if (route.name === TabScreens.Watched) {
                iconName = 'eye-outline';
            } else if (route.name === TabScreens.FindNewMovie) {
                iconName = 'search-outline';
            }
            return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
    }),
    screens: {
        [TabScreens.Unwatched]: UnwatchedScreen,
        [TabScreens.Watched]: WatchedScreen,
        [TabScreens.FindNewMovie]: FindNewScreen,
    },
});

export const Navigation = createStaticNavigation(TabBar);
