import { FlatList, TouchableOpacity, Image, StyleSheet, Text, View, ScrollView, useWindowDimensions } from 'react-native'
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../assets/fonts/Fonts';
import Colors from '../../assets/Colors'
import { MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { photos } from '../../assets/Data';
import { TabBar, SceneMap, TabView } from 'react-native-tab-view'
import profilePhoto from '../../assets/images/profileImage.jpg'
const ScoreRoutes = () => (
  <View style = {{flex: 1}}>
    <Text style = {{fontFamily: Fonts.MontserratBold, color: Colors.green, fontSize: 18}}>+500 {'\n'} +1000</Text>
  </View>
);

const ApplicationRoutes = () => (
  <View style = {{flex:1}}>
    <Text style = {{fontFamily: Fonts.Montserrat, fontSize: 18}}>Заявка на получение</Text>
  </View>
);

const renderScene = SceneMap({
  first: ScoreRoutes,
  second: ApplicationRoutes,
});

const routes = [
  {key: "first", title: "История начислений баллов"},
  {key: "second", title: "Мои заявки"},
];

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: Colors.black }}
    style={{ backgroundColor: Colors.yellowDarkness }}
    activeColor = {Colors.black}
    inactiveColor= {Colors.gray}
  />
);

const profilePhotoUri = Image.resolveAssetSource(profilePhoto).uri

const ProfileScreen = () => {
  const [selectedImage, setSelectedImage] = useState(profilePhotoUri);

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  let points = 5000;
  const [editProfile, setEditProfile] = useState(false);
  const navigation = useNavigation();

  const handleImage = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    });
    if (!res.canceled){
      setSelectedImage(res.assets[0].uri)
    }
  };
  const username = "Sergey"
  const surname = "Kopanenko"
  return (
    <View style = {styles.container}>
      <TouchableOpacity onPress = {() => setEditProfile(true)} style = {{backgroundColor: Colors.yellowDarkness, position: 'absolute', borderWidth: 1, top:'5%', left: '75%', width: '23%', borderRadius: 10, padding: 5}}>
        <Text style = {{fontFamily: Fonts.Montserrat}}>Edit profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress = { () => navigation.goBack() }style = {{borderWidth: 1, borderRadius: 25, position: 'absolute', marginTop: '10%', marginLeft: '3%'}}>
        <MaterialIcons name = "keyboard-arrow-left" size ={36} color = {Colors.black}/>
      </TouchableOpacity>
      <View>
        <View style = {{alignItems: 'center', marginTop: '20%'}}>
          <TouchableOpacity onPress = {handleImage}>
            <Image source={{uri: selectedImage}}
            style = {{
              height: 120,
              width: 120,
              borderRadius: 100,
              borderWidth: 1,
              borderColor: Colors.gray,
            }}/>
          </TouchableOpacity>
        </View>
        <View style = {{marginLeft: '5%'}}>
          <Text style = {{fontSize: 12, fontFamily: Fonts.MontserratBold}}>Имя:</Text>
          <View style = {{paddingLeft: 10, padding: 5, borderColor: Colors.yellowDarkness, borderWidth: 2, borderRadius: 10, marginRight: '5%'}}>
            <Text style = {{fontSize: 16, fontFamily: Fonts.Montserrat}}>
              {username}
            </Text>
          </View>
          <Text style = {{fontSize: 12, fontFamily: Fonts.MontserratBold}}>Фамилия:</Text>
          <View style = {{paddingLeft: 10, padding: 5, borderColor: Colors.yellowDarkness, borderWidth: 2, borderRadius: 10, marginRight: '5%'}}>
            <Text style = {{fontSize: 16, fontFamily: Fonts.Montserrat}}>
              {surname}
            </Text>
          </View>
        </View>
        <Text style = {{textAlign: 'center', fontSize:18, fontFamily: Fonts.Montserrat, marginTop: 10}}>История полученных наград</Text>
      </View>
      <View>
      <FlatList style = {{height: '11%', marginLeft: '5%'}} horizontal = {true} showsHorizontalScrollIndicator = {false} data = {photos}
          numColumns={1}
          renderItem = {({item, index}) =>
          (
            <Image 
            key = {index}
            source = {item}
            style = {{width:  80, height: 80, borderRadius: 15, borderWidth: 1, marginRight: 10}} />
          )} 
      />
      </View>
      <View style = {{marginLeft: '5%'}}>
        <Text style = {{fontSize: 18, fontFamily: Fonts.Montserrat}}>
          Количество баллов : {points}
        </Text>
      </View>
      <View style = {{flex: 1, marginHorizontal: 22, marginTop: 20}}>
        <TabView 
          navigationState = {{ index, routes }}
          renderScene = {renderScene}
          onIndexChange = {setIndex}
          initialLayout = {{width: layout.width}}
          renderTabBar={renderTabBar}
        />
      </View>
    </View>
  )
}

export default ProfileScreen

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
    height:"40%",
    marginTop: "10%",
    borderRadius: 100,
    backgroundColor: Colors.yellowDarkness,
  },
  buttonContainer:{
    borderRadius: 50,
    width: '95%',
    alignItems: 'center',
    height: 'auto',
  },
  scrollView: {
    height: '15%',
    width: '90%',
    margin: 10,
    paddingTop: 2,
    paddingLeft: 3,
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 20,
    borderColor: Colors.yellowDarkness,
  },
})