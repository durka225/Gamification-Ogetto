import { Pressable, TextInput, TouchableOpacity, StyleSheet, Text, View, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../assets/fonts/Fonts';
import Colors from '../../assets/Colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://***/api/auth";

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  let formEmailStatus = true;
  let formPasswordStatus = password.length > 4;
  let boolStatusFormsLogin = formEmailStatus && formPasswordStatus;

  const handleRegistration = () => {
    navigation.navigate("Registration");
  };
  const checkExistingSession = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'App' }],
        });
      }
    } catch (error) {
      console.error('Ошибка проверки сессии:', error);
    }
  };
  React.useEffect(() => {
      checkExistingSession();
  }, []);
  const refreshAccessToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) return null;

      const response = await axios.post('http://***/auth/refresh', {
        token: refreshToken,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      const { token } = response.data;
      if (token) {
        await AsyncStorage.setItem('accessToken', token);
        return token;
      }
      return null;
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      return null;
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        API_URL,
        { login: email, password: password },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      await AsyncStorage.setItem('accessToken', response.data.accessToken);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);

      navigation.navigate('App');
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          Alert.alert('Токен обновлен', 'Попробуйте войти снова.');
        } else {
          Alert.alert('Ошибка', 'Сессия истекла. Войдите заново.');
        }
      } else {
        console.error("Ошибка авторизации:", error);
        Alert.alert('Ошибка', 'Ошибка авторизации');
      }
    }
  };

  return (
    <View style={styles.container}>
        <Image style={{height:"25%", width: "50%"}}
          source={require('../../assets/images/logoLogin.png')}
        />
      <View style={[styles.inputWrapper, { marginTop: '10%' }]}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.textInputWithIcon}
          placeholder="Почта"
          placeholderTextColor={Colors.gray}
          keyboardType="email-address"
        />
        <Image
          style={styles.icon}
          source={
            email === ''
              ? require('../../assets/images/emailIcon.png')
              : formEmailStatus
              ? require('../../assets/images/correctFormIcon.png')
              : require('../../assets/images/emailIcon.png')
          }
        />
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          style={styles.textInputWithIcon}
          placeholder="Пароль"
          placeholderTextColor={Colors.gray}
        />
        <Image
          style={styles.icon}
          source={
            formPasswordStatus
              ? require('../../assets/images/correctFormIcon.png')
              : require('../../assets/images/passwordIcon.png')
          }
        />
      </View>

      <View style={{ marginLeft: '64%' }}>
        <TouchableOpacity>
          <Text
            onPress={handleRegistration}
            style={{
              fontSize: 13,
              color: Colors.black,
              fontFamily: Fonts.MontserratBold,
              marginLeft: '3%',
            }}
          >
            Забыли пароль?
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.loginContainer}>
        <TouchableOpacity
          style={[
            styles.loginButton,
            { backgroundColor: boolStatusFormsLogin ? Colors.orange : 'rgba(235, 200, 0, 0.45)' },
            { elevation: boolStatusFormsLogin ? 8 : 0 },
          ]}
          disabled={!boolStatusFormsLogin}
          activeOpacity={1}
          onPress={handleLogin}
        >
          <Text style={[styles.loginText, { color: boolStatusFormsLogin ? Colors.black : 'rgba(0, 0, 0, 0.34)' }]}>
            ВОЙТИ
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', top: 18 }}>
        <TouchableOpacity>
          <Text
            onPress={handleRegistration}
            style={{
              fontSize: 12,
              color: Colors.black,
              fontFamily: Fonts.MontserratBold,
              marginLeft: 5,
            }}
          >
            Зарегистрироваться
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.black,
    width: '80%',
    marginBottom: 10,
  },
  textInputWithIcon: {
    flex: 1,
    fontFamily: Fonts.Montserrat,
    fontSize: 16,
    paddingVertical: 10,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  loginContainer: {
    flexDirection: 'row',
    width: "80%",
    height: "9%",
    borderRadius: 70,
    marginTop: "50%",
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    borderRadius: 100,
  },
  loginText: {
    fontSize: 24,
    fontFamily: Fonts.Montserrat,
  },
});
