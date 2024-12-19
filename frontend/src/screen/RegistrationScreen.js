import { TextInput, TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../assets/fonts/Fonts';
import Colors from '../../assets/Colors'
import { LinearGradient } from 'expo-linear-gradient';

const RegistrationScreen = () => {
  const navigation = useNavigation();
  const handleLogin = () => {
    navigation.navigate("Login");
  }  

  let boolStatusFormsRegistration = false;
  let userForm = false;
  let emailForm = false;
  let passwordForm = false;
  let confirmPasswordForm = false;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [isUsernameTouch, setIsUsernameTouch] = useState(false);
  const [isEmailTouch, setIsEmailTouch] = useState(false);
  const [isPasswordTouch, setIsPasswordTouch] = useState(false);
  const [isConfirmPasswordTouch, setIsConfirmPasswordTouch] = useState(false);

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
  
  const checkConfirmPasswordValidity = (value) => {
    if (value!== password) return 'Пароли не совпадают.';
    return null;
  }

  const handleRegistration = () => {
    navigation.navigate("Main");
  };
  const handleUsernameChange = (text) => {
    if (!isUsernameTouch) setIsUsernameTouch(true);
    setUsername(text);
    const error = checkUsernameValidity(text);
    setUsernameError(error);
  };
  const handleEmailChange = (text) => {
    if (!isEmailTouch) setIsEmailTouch(true);
    setEmail(text);
    const error = checkEmailValidity(text);
    setEmailError(error);
  };
  
  const handlePasswordChange = (text) => {
    if (!isPasswordTouch) setIsPasswordTouch(true);
    setPassword(text);
    const error = checkPasswordValidity(text);
    setPasswordError(error);
  };

  const handleConfirmPasswordChange = (text) => {
    if (!isConfirmPasswordTouch) setIsConfirmPasswordTouch(true);
    setConfirmPassword(text);
    const error = checkConfirmPasswordValidity(text);
    setConfirmPasswordError(error);
  };

  !usernameError && isUsernameTouch ? (userForm = true)     : (userForm = false);
  !passwordError && isPasswordTouch ? (passwordForm = true) : (passwordForm = false);
  !emailError    && isEmailTouch    ? (emailForm = true)    : (emailForm = false);
  !confirmPasswordError && isConfirmPasswordTouch ? (confirmPasswordForm = true) : (confirmPasswordForm = false);
  userForm && passwordForm && confirmPasswordForm && emailForm ? boolStatusFormsRegistration = true : boolStatusFormsRegistration = false;
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#FFED00', '#FDC200']}
        locations={[0, 0.6, 0.96]}
        style={styles.gradient}
      ></LinearGradient>
      <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 120, marginTop: '20%'}}>
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
        {userForm ? 
          <Image  style = {{position: 'absolute', left: '92%', top: '35%'}}
                  source= {require('../../assets/images/correctFormIcon.png')}/> : 
          <Image  style = {{position: 'absolute', left: '92%', top: '35%'}}
                  source= {require('../../assets/images/userIcon.png')}/>
        }
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
        {emailForm ? 
          <Image  style = {{position: 'absolute', left: '92%', top: '35%'}}
                  source= {require('../../assets/images/correctFormIcon.png')}/> : 
          <Image  style = {{position: 'absolute', left: '92%', top: '35%'}}
                  source= {require('../../assets/images/emailIcon.png')}/>
        }
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
          placeholder="Придумайте пароль"
          placeholderTextColor = {Colors.gray}
        />
        {passwordForm ? 
          <Image  style = {{position: 'absolute', left: '92%', top: '35%'}}
                  source= {require('../../assets/images/correctFormIcon.png')}/> : 
          <Image  style = {{position: 'absolute', left: '92%', top: '35%'}}
                  source= {require('../../assets/images/passwordIcon.png')}/>
        }
      </View>
      <View style = {{textAlign: 'center'}}>
        {passwordError ? 
        <Text style={styles.wrongText}>
          {passwordError}
        </Text> : <Text> </Text>}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(text) => handleConfirmPasswordChange(text)}
          value={confirmPassword}
          secureTextEntry={true}
          style={styles.textInput}
          placeholder="Повторите пароль"
          placeholderTextColor = {Colors.gray}
        />
        {confirmPasswordForm ? 
          <Image  style = {{position: 'absolute', left: '92%', top: '35%'}}
                  source= {require('../../assets/images/correctFormIcon.png')}/> : 
          <Image  style = {{position: 'absolute', left: '92%', top: '35%'}}
                  source= {require('../../assets/images/passwordIcon.png')}/>
        }
      </View>
      <View style = {{textAlign: 'center'}}>
        {confirmPasswordError ? 
        <Text style={styles.wrongText}>
          {confirmPasswordError}
        </Text> : <Text> </Text>}
      </View>
      <View style={styles.loginContainer}>
        <TouchableOpacity
          style={[
            styles.loginButton,
            { backgroundColor: boolStatusFormsRegistration ? Colors.orange : 'rgba(235, 200, 0, 0.45)' },
            ]}
            activeOpacity={1}
            disabled = {!boolStatusFormsRegistration}
            onPress={handleRegistration}
          >
          <Text style={[styles.loginText, 
            {color: boolStatusFormsRegistration ?  Colors.black : 'rgba(0, 0, 0, 0.34)'},
            { elevation: boolStatusFormsRegistration ? 8 : 0 }
            ]}>ЗАРЕГИСТРИРОВАТЬСЯ</Text>
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
  },
  gradient: {
    position: 'absolute',
    height: '100%',
    left: 0,
    right: 0,
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
