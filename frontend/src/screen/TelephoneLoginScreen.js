import { TextInput, Image, Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native';
import Colors from '../../assets/Colors'
import { Fonts } from '../../assets/fonts/Fonts';
import { TextInputMask } from 'react-native-masked-text';
import { LinearGradient } from 'expo-linear-gradient';
const TelephoneLoginScreen = () => {
  let statusButton = false;
  const [telephone, setTelephone] = useState('');

  const handleLogin = () => {
    navigation.navigate("Main");
  };
  const maxLengthPhoneNumber = 16;
  const navigation = useNavigation();
  return (
    <View style = {styles.container}>
      <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
        <TouchableOpacity onPress = { () => navigation.goBack() } activeOpacity = {1} style = {{position: 'absolute', right: '43%', top: '25%'}}>
          <Image source={require('../../assets/images/backIcon.png')}/>
        </TouchableOpacity>
        <Text style={{fontFamily:Fonts.Montserrat, fontSize: 36, marginBottom: 16}}>Вход</Text>
      </View>
      <Text style={{fontSize: 15, marginBottom: 60}}>Номер телефона</Text>
      <View style={styles.inputContainer}>
        <TextInputMask
          style={styles.textInput}
          type={'custom'}
          options={{
            mask: '+7-999-999-99-99',
          }}
          maxLength={maxLengthPhoneNumber}
          value={telephone}
          onChangeText={text => setTelephone(text)}
          placeholder="Введите номер телефона"
          keyboardType="numeric"
        />
        {telephone.length == 16 ? statusButton = true : statusButton = false}
        {telephone.length == 16 ? 
          <Image  style = {{position: 'absolute', left: '92%', top: '35%'}} 
                  source={require('../../assets/images/correctFormIcon.png')}/> : 
          <Image  style = {{position: 'absolute', left: '92%', top: '35%'}} 
                  source={require('../../assets/images/telephoneIconLogin.png')}/>
        }
      </View>
      <View style={[styles.loginContainer, {marginBottom: '40%'}]}>
        <TouchableOpacity
          style={[
            styles.loginButton,
            { backgroundColor: statusButton ?  Colors.orange :'rgba(235, 200, 0, 0.45)' },
            { elevation: statusButton ? 8 : 0 }
          ]}
          disabled = {!statusButton}
          activeOpacity={1}
          onPress={handleLogin}
        >
          <Text style={[styles.loginText , {color: statusButton ?  Colors.black : 'rgba(0, 0, 0, 0.34)'}]}>ВОЙТИ</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default TelephoneLoginScreen

const styles = StyleSheet.create({
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
    marginBottom: 70,
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
  },
})