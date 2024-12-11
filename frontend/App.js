import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from "./src/screen/HomeScreen"
import LoginScreen from "./src/screen/LoginScreen"
import RegistrationScreen from "./src/screen/RegistrationScreen"
import MainScreen from "./src/screen/MainScreen"
import ProfileScreen from "./src/screen/ProfileScreen";
import { NavigationContainer } from '@react-navigation/native'
import CatalogScreen from "./src/screen/CatalogScreen";
import TelephoneLoginScreen from "./src/screen/TelephoneLoginScreen";
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name = {"Home"} component={HomeScreen} />
        <Stack.Screen name = {"Login"} component={LoginScreen} />
        <Stack.Screen name = {"Registration"} component={RegistrationScreen} />
        <Stack.Screen name = {"TelephoneLogin"} component={TelephoneLoginScreen} />
        <Stack.Screen name = {"Main"} component={MainScreen} />
        <Stack.Screen name = {"Profile"} component={ProfileScreen} />
        <Stack.Screen name = {"Catalog"} component={CatalogScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App