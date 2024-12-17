import { Pressable, TextInput, TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../assets/fonts/Fonts';
import Colors from '../../assets/Colors'

const LoginScreen = () => {
  const navigation = useNavigation();

  let formEmailStatus = false;
  let formPasswordStatus = false;
  let boolStatusFormsLogin = false;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkEmail, setCheckEmail] = useState(false);

  const handleRegistration = () => {
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

  !checkEmail ? formEmailStatus = true : formEmailStatus = false;
  password.length > 7 ? formPasswordStatus = true : formPasswordStatus = false;
  formEmailStatus && formPasswordStatus? boolStatusFormsLogin = true : boolStatusFormsLogin = false;

  const handleLogin = () => {
    if (!checkEmail && email && password) {
      navigation.navigate("Main");
    } else {
      alert("Пожалуйста, заполните все поля корректно.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          onChangeText={(text) => handleCheckEmail(text)}
          style={[styles.textInput]}
          placeholder="Логин или почта"
          placeholderTextColor= {Colors.gray}
          keyboardType="email-address"
        />
        {email === '' ? (
          <Image
            style={{ position: 'absolute', left: '92%', top: '35%' }}
            source={require('../../assets/images/userIcon.png')}
          />
        ) : formEmailStatus ? (
          <Image
            style={{ position: 'absolute', left: '92%', top: '35%' }}
            source={require('../../assets/images/correctFormIcon.png')}
          />
        ) : (
          <Image
            style={{ position: 'absolute', left: '92%', top: '35%' }}
            source={require('../../assets/images/userIcon.png')}
          />
        )}
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
        {formPasswordStatus ? 
          <Image  style = {{position: 'absolute', left: '92%', top: '35%'}}
                  source= {require('../../assets/images/correctFormIcon.png')}/> : 
          <Image  style = {{position: 'absolute', left: '92%', top: '35%'}}
                  source= {require('../../assets/images/passwordIcon.png')}/>
        }
      </View>
      <View style={{marginLeft: '64%'}}>
        <TouchableOpacity style = {{ width: '100%' }}>
          <Text onPress={handleRegistration} style={{fontSize: 13, color: Colors.black, fontFamily: Fonts.MontserratBold, marginLeft: '3%', marginTop: '5%' }}>
            Забыли пароль?
          </Text>
        </TouchableOpacity>
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
            { backgroundColor: boolStatusFormsLogin ? Colors.orange : 'rgba(235, 200, 0, 0.45)' },
          ]}
          disabled = {!boolStatusFormsLogin}
          activeOpacity={1}
          onPress={handleLogin}
        >
          <Text style={[styles.loginText, {color: boolStatusFormsLogin ?  Colors.black : 'rgba(0, 0, 0, 0.34)'}]}>ВОЙТИ</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', top: 18 }}>
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
    alignItems: 'center',
    flex: 1,
    top: '8%',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '50%',
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
    borderRadius: 70,
    width: 346,
    height: 73,
    top: 5,
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
