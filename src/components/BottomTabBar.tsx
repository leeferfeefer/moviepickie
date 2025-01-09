import Icon from '@react-native-vector-icons/ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UnwatchedScreen } from '../screens/UnwatchedScreen';
import { WatchedScreen } from '../screens/WatchedScreen';
import { FindNewScreen } from '../screens/FindNewScreen';
import { createStaticNavigation } from '@react-navigation/native';

const TabBar = createBottomTabNavigator({
    screenOptions: ({ route }) => ({
        tabBarIcon: ({ color, size }) => {
            let iconName: any;
            if (route.name === 'Unwatched') {
                iconName = 'eye-off-outline';
            } else if (route.name === 'Watched') {
                iconName = 'eye-outline';
            } else if (route.name === 'FindNew') {
                iconName = 'search-outline';
            }
            return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
    }),
    screens: {
        Unwatched: UnwatchedScreen,
        Watched: WatchedScreen,
        FindNew: FindNewScreen,
    },
});

export const Navigation = createStaticNavigation(TabBar);
