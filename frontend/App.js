import React, { useState, useEffect } from "react";
import { Image, BackHandler, View, ActivityIndicator, StyleSheet } from 'react-native';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import CustomDrawer from "./src/screen/CustomDrawer";
import LoginScreen from "./src/screen/LoginScreen";
import RegistrationScreen from "./src/screen/RegistrationScreen";
import MainScreen from "./src/screen/MainScreen";
import ProfileScreen from "./src/screen/ProfileScreen";
import CatalogScreen from "./src/screen/CatalogScreen";
import CategoriesScreen from "./src/screen/CategoriesScreen";
import ActivityScreen from "./src/screen/ActivityScreen";
import HistoryList from "./src/screen/HistoryList";
import RewardsScreen from "./src/screen/RewardsScreen";
import AddCategoryScreen from "./src/screen/AddCategoryScreen";
import RequestListScreen from "./src/screen/RequestListScreen";
import AddActivityScreen from "./src/screen/AddActivityScreen";
import AddRewardScreen from "./src/screen/AddRewardScreen";
import TelephoneLoginScreen from "./src/screen/TelephoneLoginScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import pointsAdd from "./src/screen/pointsAdd";
import EditRewardScreen from "./src/screen/EditRewardScreen";
import EditActivityScreen from "./src/screen/EditActivityScreen";
import EditCategoryScreen from "./src/screen/EditCategoryScreen";
import axios from 'axios';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const AuthStack = () => {
  useEffect(() => {
    const onBackPress = () => {
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="TelephoneLogin" component={TelephoneLoginScreen} />
    </Stack.Navigator>
  );
};

const MainDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "#FFA500",
        drawerInactiveTintColor: "#000",
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      <Drawer.Screen
        name="Main"
        component={MainScreen}
        options={{
          drawerLabel: "Главное меню",
          drawerIcon: ({ color }) => <Image source={require('./assets/imagesMenu/main.png')} size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerLabel: "Личный кабинет",
          drawerIcon: ({ color }) => <Image source={require('./assets/imagesMenu/profile.png')} size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Catalog"
        component={CatalogScreen}
        options={{
          drawerLabel: "Каталог наград",
          drawerIcon: ({ color }) => <Image source={require('./assets/imagesMenu/reward.png')} size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          drawerLabel: "Список категорий",
          drawerIcon: ({ color }) => <Image source={require('./assets/imagesMenu/categories.png')} size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Rewards"
        component={RewardsScreen}
        options={{
          drawerLabel: "Список наград",
          drawerIcon: ({ color }) => <Image source={require('./assets/imagesMenu/rewardList.png')} size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="RequestList"
        component={RequestListScreen}
        options={{
          drawerLabel: "Мои заявки",
          drawerIcon: ({ color }) => <Image source={require('./assets/imagesMenu/activity.png')} size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="History"
        component={HistoryList}
        options={{
          drawerLabel: "Транзакции",
          drawerIcon: ({ color }) => <Image source={require('./assets/imagesMenu/score.png')} size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Activity"
        component={ActivityScreen}
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="AddCategory"
        component={AddCategoryScreen}
        options={{ title: "Добавить категорию", drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="AddActivity"
        component={AddActivityScreen}
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="AddReward"
        component={AddRewardScreen}
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen 
        name="EditReward"
        component={EditRewardScreen}
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="EditActivity" 
        component={EditActivityScreen}
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="EditCategory"
        component={EditCategoryScreen}
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="PointsAdd"
        component={pointsAdd}
        options={{ drawerItemStyle: { display: 'none' } }}
      />
    </Drawer.Navigator>
  );
};

function RootApp() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await AsyncStorage.clear(); // Очищаем storage при запуске
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('./assets/images/logoLogin.png')}
          style={{ width: 160, height: 160, marginBottom: 24, resizeMode: 'contain' }}
        />
        <ActivityIndicator size="large" color="#FFED00" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Auth"
        screenOptions={{ 
          headerShown: false,
          gestureEnabled: false, 
          animationEnabled: false, 
          detachInactiveScreens: true 
        }}
      >
        <Stack.Screen 
          name="Auth" 
          component={AuthStack}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="App" 
          component={MainDrawer}
          options={{
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootApp;
