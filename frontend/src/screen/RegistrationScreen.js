import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../assets/fonts/Fonts';
import Colors from '../../assets/Colors';
import axios from 'axios';

const API_URL = "http://***/api/user";

const RegistrationScreen = () => {
  const navigation = useNavigation();

  const [name, setname] = useState('');
  const [surname, setsurname] = useState('');
  const [login, setlogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setnameError] = useState('');
  const [surnameError, setsurnameError] = useState('');
  const [loginError, setloginError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const checknameValidity = (value) => {
    if (value.length < 2) return 'Имя должно быть больше 1 символа';
    return '';
  };

  const checksurnameValidity = (value) => {
    if (value.length < 2) return 'Фамилия должна быть больше 1 символа';
    return '';
  };

  const checkloginValidity = (value) => {
    return /\S+@\S+\.\S+/.test(value) ? '' : 'Введите корректный login.';
  };

  const checkPasswordValidity = (value) => {
    if (/\s/.test(value)) return 'Пароль не должен содержать пробелов.';
    if (!/[A-Z]/.test(value)) return 'Пароль должен содержать заглавную букву.';
    if (!/[a-z]/.test(value)) return 'Пароль должен содержать строчную букву.';
    if (!/\d/.test(value)) return 'Пароль должен содержать цифру.';
    if (value.length < 8 || value.length > 24) return 'Пароль должен содержать от 8 до 24 символов.';
    return '';
  };

  const checkConfirmPasswordValidity = (value) => {
    return value !== password ? 'Пароли не совпадают.' : '';
  };

  const handleRegistration = async () => {
    if (!name || !surname || !login || !password || !confirmPassword) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    try {
      const response = await axios.post(
        API_URL,
        { name, surname, login, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      navigation.navigate("Login");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('Ошибка', 'Пользователь с таким логином или email уже существует, либо данные некорректны.');
      } else {
        console.error(error.response?.data || error.message);
        Alert.alert('Ошибка', 'Не удалось зарегистрироваться. Попробуйте позже.');
      }
    }
  };

  const isFormValid =
    !checknameValidity(name) &&
    !checksurnameValidity(surname) &&
    !checkloginValidity(login) &&
    !checkPasswordValidity(password) &&
    !checkConfirmPasswordValidity(confirmPassword);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/images/backIcon.png')} />
        </TouchableOpacity>
        <Text style={styles.title}>Регистрация</Text>
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          value={name}
          onChangeText={(text) => {
            setname(text);
            setnameError(checknameValidity(text));
          }}
          style={styles.textInput}
          placeholder="Введите имя"
          placeholderTextColor={Colors.gray}
        />
        <Image
          style={styles.icon}
          source={
            name && !nameError
              ? require('../../assets/images/correctFormIcon.png')
              : require('../../assets/images/userIcon.png')
          }
        />
      </View>
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
      
      <View style={styles.inputWrapper}>
        <TextInput
          value={surname}
          onChangeText={(text) => {
            setsurname(text);
            setsurnameError(checksurnameValidity(text));
          }}
          style={styles.textInput}
          placeholder="Введите фамилию"
          placeholderTextColor={Colors.gray}
        />
        <Image
          style={styles.icon}
          source={
            surname && !surnameError
              ? require('../../assets/images/correctFormIcon.png')
              : require('../../assets/images/userIcon.png')
          }
        />
      </View>
      {surnameError ? <Text style={styles.errorText}>{surnameError}</Text> : null}

      <View style={styles.inputWrapper}>
        <TextInput
          value={login}
          onChangeText={(text) => {
            setlogin(text);
            setloginError(checkloginValidity(text));
          }}
          style={styles.textInput}
          placeholder="Введите email"
          placeholderTextColor={Colors.gray}
          keyboardType="login-address"
        />
        <Image
          style={styles.icon}
          source={
            login && !loginError
              ? require('../../assets/images/correctFormIcon.png')
              : require('../../assets/images/emailIcon.png')
          }
        />
      </View>
      {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

      <View style={styles.inputWrapper}>
        <TextInput
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError(checkPasswordValidity(text));
          }}
          secureTextEntry
          style={styles.textInput}
          placeholder="Придумайте пароль"
          placeholderTextColor={Colors.gray}
        />
        <Image
          style={styles.icon}
          source={
            password && !passwordError
              ? require('../../assets/images/correctFormIcon.png')
              : require('../../assets/images/passwordIcon.png')
          }
        />
      </View>
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <View style={styles.inputWrapper}>
        <TextInput
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setConfirmPasswordError(checkConfirmPasswordValidity(text));
          }}
          secureTextEntry
          style={styles.textInput}
          placeholder="Повторите пароль"
          placeholderTextColor={Colors.gray}
        />
        <Image
          style={styles.icon}
          source={
            confirmPassword && !confirmPasswordError
              ? require('../../assets/images/correctFormIcon.png')
              : require('../../assets/images/passwordIcon.png')
          }
        />
      </View>
      {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isFormValid ? Colors.orange : 'rgba(235, 200, 0, 0.45)' }]}
          disabled={!isFormValid}
          onPress={handleRegistration}
        >
          <Text style={[styles.buttonText, { color: isFormValid ? Colors.black : 'rgba(0, 0, 0, 0.34)' }]}>
            ЗАРЕГИСТРИРОВАТЬСЯ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontFamily: Fonts.Montserrat,
    marginLeft: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.black,
    width: '80%',
    marginBottom: 10,
  },
  textInput: {
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
  errorText: {
    color: Colors.red,
    fontSize: 10,
    fontFamily: Fonts.Montserrat,
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 10,
  },
  buttonContainer: {
    width: "80%",
    height: "10%",
    marginTop: "55%",
    borderRadius: 70,
  },
  button: {
    flex: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontFamily: Fonts.Montserrat,
  },
});
