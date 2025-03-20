import Icon from "@react-native-vector-icons/ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UnwatchedScreen } from "../screens/UnwatchedScreen";
import { WatchedScreen } from "../screens/WatchedScreen";
import { FindScreen } from "../screens/FindScreen";
import { NewScreen } from "../screens/NewScreen";
import { RandomMovieHeaderButton } from "./RandomMovieHeaderButton";
import React from "react";

export enum TabScreens {
    Unwatched = "Unwatched",
    Watched = "Watched",
    Find = "Find",
    New = "New",
}

export const TabBar = createBottomTabNavigator({
    screens: {
        [TabScreens.Unwatched]: UnwatchedScreen,
        [TabScreens.Watched]: WatchedScreen,
        [TabScreens.New]: NewScreen,
        [TabScreens.Find]: FindScreen,
    },
    screenOptions: ({ route }) => ({
        tabBarIcon: ({ color, size }) => {
            let iconName: any;
            if (route.name === TabScreens.Unwatched) {
                iconName = "eye-off-outline";
            } else if (route.name === TabScreens.Watched) {
                iconName = "eye-outline";
            } else if (route.name === TabScreens.Find) {
                iconName = "search-outline";
            } else if (route.name === TabScreens.New) {
                iconName = "newspaper-outline";
            }
            return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        headerShown: true,
        headerTitle: "MoviePickie",
        headerRight: () => {
            if (route.name === TabScreens.Unwatched) {
                return <RandomMovieHeaderButton />;
            } else {
                return null;
            }
        },
    }),
});
