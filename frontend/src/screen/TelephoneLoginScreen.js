import { Image, Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import Colors from '../../assets/Colors'
import { Fonts } from '../../assets/fonts/Fonts';

const TelephoneLoginScreen = () => {
  const navigation = useNavigation();
  return (
    <View style = {styles.container}>
     
    </View>
  )
}

export default TelephoneLoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
})