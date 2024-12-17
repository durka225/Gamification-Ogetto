import { TextInput, TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../assets/fonts/Fonts';
import Colors from '../../assets/Colors'
const RegistrationScreen = () => {
  const navigation = useNavigation();
  const handleLogin = () => {
    navigation.navigate("Login");
  }  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const checkUsernameValidity = (value) => {
    const isValidLength = /^.{4,50}$/;
    if (!isValidLength.test(value)) {
        return 'Имя пользователя должно быть больше 3 символов';
    }
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(value)) {
      return 'Имя пользователя не должно содержать пробелов.';
    }
    return null
  }

  const checkEmailValidity = (value) => {
    const re = /\S+@\S+\.\S+/;
    if (!re.test(value)) {
      return 'Введите корректный email.';
    }
    return null;
  }

  const checkPasswordValidity = (value) => {
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(value)) {
      return 'Пароль не должен содержать пробелов.';
    }
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(value)) {
      return 'Пароль должен содержать хотя бы одну заглавную букву.';
    }
    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(value)) {
      return 'Пароль должен содержать хотя бы одну строчную букву.';
    }
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(value)) {
      return 'Пароль должен содержать хотя бы одну цифру.';
    }
    const isValidLength = /^.{8,24}$/;
    if (!isValidLength.test(value)) {
      return 'Пароль должен содержать от 8 до 24 символов.';
    }
    return null;
  };
  
  const handleRegistration = () => {
    const errorPassw = checkPasswordValidity(password);
    const errorUser = checkUsernameValidity(username);
    const errorMail = checkEmailValidity(email);
    if (!errorUser) {
       if(!errorMail){
          if(!errorPassw){
            navigation.navigate("Main");
          }
          else{
            alert(errorPassw);
          }
       }
       else{
        alert(errorMail);
       }
    } else {
      alert(errorUser);
    }
  };
  const handleUsernameChange = (text) => {
    setUsername(text);
    const error = checkUsernameValidity(text);
    setUsernameError(error);
  };
  const handlePasswordChange = (text) => {
    setPassword(text);
    const error = checkPasswordValidity(text);
    setPasswordError(error);
  };
  const handleEmailChange = (text) => {
    setEmail(text);
    const error = checkEmailValidity(text);
    setEmailError(error);
  };
  return (
    <View style={styles.container}>
      <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 120}}>
        <TouchableOpacity onPress = { () => navigation.goBack() } activeOpacity = {1} style = {{position: 'absolute', right: 240}}>
          <Image source={require('../../assets/images/backIcon.png')}/>
        </TouchableOpacity>
        <View style = {{alignItems: 'center'}}>
          <Text style = {{ fontSize: 36, fontFamily: Fonts.Montserrat}}>Регистрация</Text>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(text) => handleUsernameChange(text)}
          value={username}
          style={styles.textInput}
          placeholder="Введите имя пользователя"
          placeholderTextColor= {Colors.gray}
        />
        <Image style = {{position: 'absolute', left: '92%', top: '40%'}} source={require('../../assets/images/userIcon.png')}/>
      </View>
      <View style = {{textAlign: 'center'}}>
        {usernameError ? 
        <Text style={styles.wrongText}>
          {usernameError}
        </Text> : <Text> </Text>}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          onChangeText={(text) => handleEmailChange(text)}
          style={[styles.textInput]}
          placeholder="Введите email"
          placeholderTextColor= {Colors.gray}
          keyboardType="email-address"
        />
        <Image style = {{position: 'absolute', left: '92%', top: '40%'}} source={require('../../assets/images/emailIcon.png')}/>
      </View>
      <View style = {{textAlign: 'center'}}>
        {emailError ?
        <Text style={styles.wrongText}>
            Некорректный ввод почты
        </Text>
        : <Text> </Text>}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(text) => handlePasswordChange(text)}
          value={password}
          secureTextEntry={true}
          style={styles.textInput}
          placeholder="Введите пароль"
          placeholderTextColor = {Colors.gray}
        />
        <Image style = {{position: 'absolute', left: '92%', top: '40%'}} source={require('../../assets/images/passwordIcon.png')}/>
      </View>
      <View style = {{textAlign: 'center'}}>
        {passwordError ? 
        <Text style={styles.wrongText}>
          {passwordError}
        </Text> : <Text> </Text>}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(text) => handlePasswordChange(text)}
          value={password}
          secureTextEntry={true}
          style={styles.textInput}
          placeholder="Введите пароль"
          placeholderTextColor = {Colors.gray}
        />
        <Image style = {{position: 'absolute', left: '92%', top: '40%'}} source={require('../../assets/images/passwordIcon.png')}/>
      </View>
      <View style = {{textAlign: 'center'}}>
        {passwordError ? 
        <Text style={styles.wrongText}>
          {passwordError}
        </Text> : <Text> </Text>}
      </View>
      <View style={styles.loginContainer}>
        <TouchableOpacity
          style={[
            styles.loginButton,
            { backgroundColor: isPressed ? Colors.yellowLight : Colors.yellowDarkness },
          ]}
          activeOpacity={1}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          onPress={handleRegistration}
        >
          <Text style={styles.loginText}>ЗАРЕГИСТРИРОВАТЬСЯ</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', width: '98%', height: '10%', justifyContent: 'center', marginTop: 15 }}>
        <Text style={{ fontSize: 12, fontFamily: Fonts.Montserrat }}>Уже есть аккаунт?</Text>
        <TouchableOpacity>
          <Text onPress={handleLogin} style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.MontserratBold , marginLeft: 5 }}>
            Войти.
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegistrationScreen;

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    top: '5%',
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderColor: Colors.black,
    width: '80%',
  },
  textInput: {
    fontFamily: Fonts.Montserrat,
    fontSize: 16,
    top: '15%',
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    borderRadius: 100,
  },
  loginText: {
    color: Colors.black,
    fontSize: 24,
    fontFamily: Fonts.Montserrat,
  },
  loginContainer: {
    marginTop: '15%',
    flexDirection: 'row',
    borderRadius: 70,
    width: 346,
    height: 73,
  },
  wrongText: {
    fontSize: 10,
    fontFamily: Fonts.Montserrat,
    color: Colors.red,
    marginTop: 5,
    marginBottom: 5,
  },
});
