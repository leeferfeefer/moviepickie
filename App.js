import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./screens/Home";
import Detail from "./screens/Detail";

const RootStack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Group>
          <RootStack.Screen name="List" component={Home} />
        </RootStack.Group>
        <RootStack.Group screenOptions={{ presentation: 'modal' }}>
          <RootStack.Screen 
            name="Detail" 
            component={Detail} 
            options={({ route }) => {
              return ({ title: route.params.selectedMovie.title});            
            }}
          />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
