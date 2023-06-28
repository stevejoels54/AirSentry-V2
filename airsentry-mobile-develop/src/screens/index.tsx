import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./homeScreen";
import DevicesScreen from "./devicesScreen";
import TrendsScreen from "./trends";

const Stack = createNativeStackNavigator();

const Screens = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: "#F2F2F2",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShadowVisible: false,
          headerTransparent: true,
        }}
      >
        <Stack.Screen
          options={{ headerShown: false }}
          name="Devices"
          component={DevicesScreen}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Trends"
          component={TrendsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Screens;
