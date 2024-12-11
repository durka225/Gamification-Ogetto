import { Image, Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import Colors from '../../assets/Colors'
import { Fonts } from '../../assets/fonts/Fonts';
import PagerView from 'react-native-pager-view';
import Dots from 'react-native-dots-pagination';

const MainScreen = () => {
  const name = "Sergey";
  const navigation = useNavigation();
  const toProfile = () => {
    navigation.navigate("Profile");
  }
  const toCatalog = () => {
    navigation.navigate("Catalog");
  }
  return (
    <View style = {styles.container}>
      <View style = {{}}>
        <View style = {{borderRadius: 20,backgroundColor: Colors.yellowDarkness, borderWidth: 1, height: '25%'}}>
          <View style = {{top: '30%',borderWidth: 1, width: '40%', borderRadius: 20, padding: 5, marginLeft: '5%'}}>
            <TouchableOpacity
            style = {{}} onPress = {toCatalog}>
              <Text style = {{textAlign: 'center', color: Colors.black, fontSize: 24, fontFamily: Fonts.Montserrat}}>Каталог наград</Text>
            </TouchableOpacity>
          </View>
          <View style = {{ width: '25%' , marginLeft: '50%', bottom: '10%'}}>
            <Text style = {{fontFamily: Fonts.Montserrat, fontSize: 28,}}>{name}</Text>
          </View>
          <View style = {{alignItems: 'flex-end'}}>
            <TouchableOpacity style = {{marginRight: '3%', bottom: '87%', borderRadius: 50}} activeOpacity={1} onPress = {toProfile}>
              <Image source={require("../../assets/images/profileImage.jpg")}
              style = {{
                height: 80,
                width: 80,
                borderRadius: 100,
              }}/>
            </TouchableOpacity>
          </View>
        </View>
        <View style = {{borderRadius: 20,marginLeft: '10%',width: '80%', borderWidth: 1, height: '45%', marginTop: '10%'}}>
          <PagerView style={{flex: 1}} initialPage={0}>
            <View style={styles.page} key="1">
              <Text style = {{height:'88%', fontSize: 24, fontFamily: Fonts.MontserratBold, textAlign: 'center'}}>Приветствуем в нашем приложении!</Text>
              <Dots length={4} active = {0} activeColor = {Colors.yellowDarkness}/>
            </View>
            <View style={styles.page} key="2">
              <Text style = {{height:'88%', fontSize: 24, fontFamily: Fonts.Montserrat, textAlign: 'center'}}>Здесь вы станете частью корпоративной жизни компании. Выполняя активности, вы получаете баллы,
                которые можно тратить в магазине наград.</Text>
                <Dots length={4} active = {1} activeColor = {Colors.yellowDarkness}/>
            </View>
            <View style={styles.page} key="3">
              <Text style = {{height:'88%', fontSize: 24, fontFamily: Fonts.Montserrat, textAlign: 'center'}}>Для того чтобы приобрести награду, необходимо перейти в каталог и нажать
              кнопку "Запросить награду", затем ожидайте её получения.</Text>
              <Dots length={4} active = {2} activeColor = {Colors.yellowDarkness}/>
            </View>
            <View style={styles.page} key="4">
              <Text style = {{height:'88%', fontSize: 24, fontFamily: Fonts.Montserrat, textAlign: 'center'}}>Всё в ваших руках, будьте активными
              и получайте приятные вознаграждения!</Text>
              <Dots length={4} active = {3} activeColor = {Colors.yellowDarkness}/>
            </View>
          </PagerView>
        </View>
      </View>
    </View>
  )
}

export default MainScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  item:{
    borderRadius: 10,
    width: 90,
    height: 90,
    margin: 5,
    backgroundColor: Colors.yellowDarkness,
  },
  button:{
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height:"100%",
    borderRadius: 100,
  },
  buttonContainer:{
    borderRadius: 50,
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})