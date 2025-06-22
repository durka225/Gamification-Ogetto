import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CustomDrawer = (props) => {
  const navigation = useNavigation();
  const [user, setUser] = useState({ name: '', surname: '' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return;
        const response = await axios.get('http://***/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser({
          name: response.data.name || '',
          surname: response.data.surname || ''
        });
      } catch (e) {
        setUser({ name: '', surname: '' });
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
      navigation.navigate('Auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: "#fff" }}>
        <View style={{ alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
          <Image
            source={require('../../assets/images/profileImage.jpg')}
            style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }}
          />
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {user.name} {user.surname}
          </Text>
        </View>
        <View style={{ paddingVertical: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <TouchableOpacity style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }} onPress={handleLogout}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={require('../../assets/imagesMenu/logout.png')} size={22} color={"yellow"} />
          <Text style={{ fontSize: 16, marginLeft: 10 }}>Выйти из аккаунта</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CustomDrawer;
