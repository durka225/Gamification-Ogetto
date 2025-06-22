import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

import Colors from '../../assets/Colors'
import { Fonts } from '../../assets/fonts/Fonts'
import profilePhoto from '../../assets/images/profileImage.jpg'

const profilePhotoUri = Image.resolveAssetSource(profilePhoto).uri

const ProfileScreen = () => {
  const navigation = useNavigation()
  const [selectedImage, setSelectedImage] = useState(profilePhotoUri)
  const [userData, setUserData] = useState(null)

  const handleImage = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    if (!res.canceled) {
      setSelectedImage(res.assets[0].uri)
    }
  }

  const handleCatalog = () => {
    navigation.navigate('Catalog')
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken')
        if (!token) return

        const response = await axios.get('http://***/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setUserData(response.data)
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error)
      }
    }

    fetchUserData()

    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserData()
    });
    return unsubscribe;
  }, [navigation])

  const fetchAllUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;
      const response = await axios.get('http://***/api/user/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении всех пользователей:', error);
      return [];
    }
  };

  const fetchUserTransactions = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return [];
      const response = await axios.get('http://***/api/user/transactions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; 
    } catch (error) {
      console.error('Ошибка при получении транзакций пользователя:', error);
      return [];
    }
  };


  const deleteUserById = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return false;
      await axios.delete(`http://***/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      return false;
    }
  };

  const fetchUserById = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return null;
      const response = await axios.get(`http://***/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении пользователя по id:', error);
      return null;
    }
  };

  const username = userData?.name || userData?.login || 'Имя'
  const surname = userData?.surname || ''
  const points = userData?.point || 0
  const rewards = userData?.rewards || []

  const roleMap = {
    user: 'Сотрудник',
    admin: 'Администратор',
    manager: 'Менеджер',
  }
  const roleRu = roleMap[userData?.role] || 'Сотрудник'

  const isAdmin = userData?.role === 'admin';

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Image source={require('../../assets/images/menuButton.png')} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Личный Кабинет</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.separator} />
        <Text style={styles.roleText}>{roleRu}</Text>

        <TouchableOpacity onPress={handleImage}>
          <Image source={{ uri: selectedImage }} style={styles.avatar} />
        </TouchableOpacity>

        <Text style={styles.profileText}>{username} {surname}</Text>
        <Text style={styles.points}>Баллы: {points}</Text>

        <Text style={styles.rewardsTitle}>Ранее приобретенные награды</Text>
        <FlatList
          horizontal
          data={rewards}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          style={styles.rewardList}
          contentContainerStyle={styles.rewardListContent}
          renderItem={({ item }) => (
            <View style={styles.rewardItem}>
              <Image
                source={require('../../assets/images/rewardPlaceHolder.png')}
                style={styles.rewardImage}
              />
              <Text style={styles.rewardLabel}>{item.title}</Text>
            </View>
          )}
        />

        <TouchableOpacity style={styles.catalogButton} onPress={handleCatalog}>
          <Text style={styles.catalogText}>КАТАЛОГ НАГРАД</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.catalogButton, { marginTop: 15 }]}
          onPress={() => navigation.navigate('Activity')}
        >
          <Text style={styles.catalogText}>СПИСОК АКТИВНОСТЕЙ</Text>
        </TouchableOpacity>
        
        {isAdmin && (
          <TouchableOpacity 
            style={[styles.catalogButton, { marginTop: 15 }]}
            onPress={() => navigation.navigate('PointsAdd')}
          >
            <Text style={styles.catalogText}>НАЧИСЛЕНИЕ БАЛЛОВ</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  header: {
    marginTop: 60,
    paddingHorizontal: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.Montserrat,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#000',
    width: '100%',
    marginTop: 10,
  },
  roleText: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: Fonts.Montserrat,
  },
  avatar: {
    height: 125,
    width: 125,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.gray,
    marginVertical: 10,
  },
  username: {
    fontSize: 18,
    fontFamily: Fonts.Montserrat,
    marginTop: 10,
  },
  points: {
    fontSize: 18,
    fontFamily: Fonts.Montserrat,
    marginBottom: 15,
  },
  rewardsTitle: {
    fontSize: 16,
    fontFamily: Fonts.Montserrat,
    marginVertical: 10,
  },
  rewardList: {
    marginBottom: 20,
  },
  rewardListContent: {
    paddingHorizontal: 10,
  },
  rewardItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  rewardImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  rewardLabel: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: Fonts.Montserrat,
  },
  catalogButton: {
    backgroundColor: '#FFED00',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 5,
  },
  catalogText: {
    fontFamily: Fonts.Montserrat,
    fontSize: 14,
    color: Colors.black,
  },
})
