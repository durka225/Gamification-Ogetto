import { Image, StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import Colors from '../../assets/Colors'
import { Fonts } from '../../assets/fonts/Fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const MainScreen = () => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await axios.get('http://***/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    };
    fetchUser();
  }, []);

  const toProfile = () => {
    navigation.navigate("Profile");
  }
  const toCatalog = () => {
    navigation.navigate("Catalog");
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
          <Image source={require('../../assets/images/menuButton.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>
          Привет, <Text style={styles.nameHighlight}>{userData?.name || 'Пользователь'}!</Text>
        </Text>
        <Text style={styles.tagline}>Давайте достигать целей вместе</Text>
      </View>
      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Ваши возможности:</Text>
        {['Участвуйте в интересных активностях', 'Получайте награды за достижения', 'Обменивайте баллы на призы', 'Следите за своим прогрессом'].map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Text style={styles.featureIcon}>•</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.button1} onPress={toProfile}>
        <Text style={styles.buttonText}>ПЕРЕЙТИ В ЛИЧНЫЙ КАБИНЕТ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button2} onPress={toCatalog}>
        <Text style={styles.buttonText}>КАТАЛОГ НАГРАД</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 34,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontFamily: Fonts.Montserrat,
    textAlign: 'left',
    marginBottom: 30,
    lineHeight: 24,
    color: Colors.black,
    paddingHorizontal: 20,
  },
  button1: {
    backgroundColor: '#FFEB3B',
    marginTop: '10%',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '85%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  button2: {
    backgroundColor: '#FFEB3B',
    marginTop: '5%',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '85%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 14,
  },
  menuContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  menuButton: {
    padding: 10,
  },
  greeting: {
    fontSize: 28,
    fontFamily: Fonts.MontserratBold,
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.black,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontFamily: Fonts.Montserrat,
    color: Colors.gray,
    marginBottom: 10,
  },
  nameHighlight: {
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
  },
  tagline: {
    fontSize: 16,
    fontFamily: Fonts.Montserrat,
    color: Colors.gray,
    opacity: 0.8,
  },
  featuresContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  featuresTitle: {
    fontSize: 18,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    color: Colors.yellowLight,
    marginRight: 10,
  },
  featureText: {
    fontSize: 15,
    fontFamily: Fonts.Montserrat,
    color: Colors.black,
    opacity: 0.8,
    flex: 1,
  },
});