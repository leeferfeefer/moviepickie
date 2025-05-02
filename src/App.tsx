import React from "react";
import { TabBar } from "./components/BottomTabBar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MovieDetailScreen } from "./screens/MovieDetailScreen";
import { createStaticNavigation } from "@react-navigation/native";
import { ActorDetailScreen } from "./screens/ActorDetailScreen";

const Stack = createNativeStackNavigator({
    screens: {
        Home: {
            screen: TabBar,
            options: {
                headerShown: false,
            },
        },
        MovieDetail: MovieDetailScreen,
        ActorDetail: ActorDetailScreen,
    },
});

export const Navigation = createStaticNavigation(Stack);

const App = (): React.JSX.Element => {
    return <Navigation />;
};

export default App;
