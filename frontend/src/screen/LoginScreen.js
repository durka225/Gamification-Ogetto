import { Pressable, TextInput, TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../assets/fonts/Fonts';
import Colors from '../../assets/Colors'
const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkEmail, setCheckEmail] = useState(false);

  const handleRegistration = () => {
    navigation.navigate("Home");
    navigation.navigate("Registration");
  };

  const toTelephoneLogin = () => {
    navigation.navigate("TelephoneLogin");
  }

  const handleCheckEmail = (text) => {
    const re = /\S+@\S+\.\S+/;
    setEmail(text);
    setCheckEmail(!re.test(text));
  };

  const handleLogin = () => {
    if (!checkEmail && email && password) {
      navigation.navigate("Main");
    } else {
      alert("Пожалуйста, заполните все поля корректно.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            value={email}
            onChangeText={(text) => handleCheckEmail(text)}
            style={[styles.textInput]}
            placeholder="Логин или почта"
            placeholderTextColor= {Colors.gray}
            keyboardType="email-address"
          />
          <Image style = {{position: 'absolute', left: '92%', top: '40%'}} source={require('../../assets/images/userIcon.png')}/>
        </View>
        {checkEmail ? <Text style={styles.wrongText}>Некорректный ввод почты</Text> : <Text> </Text>}
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            style={styles.textInput}
            placeholder="Пароль"
            placeholderTextColor= {Colors.gray}
          />
          <Image style = {{position: 'absolute', left: '92%', top: '40%'}} source={require('../../assets/images/passwordIcon.png')}/>
        </View>
        <View style={{marginLeft: '64%'}}>
          <TouchableOpacity style = {{ width: '100%' }}>
            <Text onPress={handleRegistration} style={{fontSize: 13, color: Colors.black, fontFamily: Fonts.MontserratBold, marginLeft: '3%', marginTop: '5%' }}>
              Забыли пароль?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style = {{textAlign: 'center', marginTop: 77, marginBottom: 123, fontSize: 15, fontFamily: Fonts.Montserrat}}>или войдите через</Text>
      <Image style = {{position: 'absolute', left: '32%', top: '52%'}} source={require('../../assets/images/googleIcon.png')}/>
      <Pressable onPress={toTelephoneLogin} style ={{position: 'absolute', left: '52%', top: '52%'}}>
        <Image style = {{}} source={require('../../assets/images/telephoneIcon.png')}/>
      </Pressable>
      <View style={styles.loginContainer}>
        <TouchableOpacity
          style={[
            styles.loginButton,
            { backgroundColor: Colors.orange },
          ]}
          activeOpacity={1}
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>ВОЙТИ</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
        <Text style={{ fontSize: 12, fontFamily: Fonts.Montserrat }}>Нет аккаунта?</Text>
        <TouchableOpacity>
          <Text onPress={handleRegistration} style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.MontserratBold, marginLeft: 5 }}>
            Зарегистрироваться.
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
    flex: 1,
    top: '15%'
  },
  formContainer: {
    alignItems: 'center',
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
    flexDirection: 'row',
    borderRadius: 50,
    width: '90%',
    height: '10%',
    marginLeft: '5%',
  },
  wrongText: {
    fontSize: 10,
    fontFamily: Fonts.Montserrat,
    color: Colors.red,
    marginLeft: 20,
    marginTop: 5,
    marginBottom: 5,
    right: '27%'
  },
});
