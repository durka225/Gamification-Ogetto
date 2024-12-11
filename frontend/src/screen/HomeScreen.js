import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../assets/fonts/Fonts';
import Colors from '../../assets/Colors'
const HomeScreen = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate("Login");
  }
  const handleRegistration = () => {
    navigation.navigate("Registration");
  }

  const [isPressed, setIsPressed] = useState(false);
  return (
    <View style = {styles.container}>
        <Image
          source = {require('../../assets/images/logo1.png')}
          style = {{
              width: '75%',
              height: '40%',
              marginTop: -50,
          }
          }
        />
        <View style = {{marginBottom:50}}>
          <Text style = {styles.headerText}> Чтобы продолжить необходимо войти в систему</Text>
        </View>
        <View style = {[styles.buttonContainer,{borderColor: isPressed ? Colors.yellowLight : Colors.yellowDarkness}]}>
          <TouchableOpacity style = {[styles.loginButton, 
            {backgroundColor: isPressed ? Colors.yellowLight : Colors.yellowDarkness},
            ]}
            activeOpacity={1}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={handleLogin}
            >
            <Text style = {styles.loginText}>Войти</Text>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.loginButton} onPress = {handleRegistration}>
            <Text style = {styles.regText}>Регистрация</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    textAlign: 'center',
    fontFamily: Fonts.Montserrat,
    fontSize: 24,
    marginHorizontal: 20,
    marginBottom: 30,
    color: Colors.black,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 50,
    overflow: 'hidden',
    width: '98%',
    height: 60,
    marginTop: 100,
  },
  loginButton:{
    justifyContent: 'center',
    alignItems: 'center',
    width: "50%",
    borderRadius: 100,
  },
  loginText:{
    color: Colors.black,
    fontSize: 22,
    fontFamily: Fonts.Montserrat,
  },
  regText:{
    color: Colors.black,
    fontSize: 22,
    fontFamily: Fonts.Montserrat,
  },
});

export default HomeScreen