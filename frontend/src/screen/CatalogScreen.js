import { ScrollView, Pressable, Modal, Image, FlatList, TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import React, {useState} from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../assets/fonts/Fonts';
import Colors from '../../assets/Colors'
import { photos, description, cost } from '../../assets/Data';

const CatalogScreen = () => {
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(null);
  return (
    <View style = {{flex: 1, backgroundColor: Colors.white}}>
      <View style = {{}}>
        <View style = {{}}>
          <TouchableOpacity onPress = { () => navigation.goBack() }style = {{borderWidth: 1, borderRadius: 25, marginTop: '12%', marginLeft:'3%', position: 'absolute'}}>
            <MaterialIcons name = "keyboard-arrow-left" size ={36} color = {Colors.black}/>
          </TouchableOpacity>
        </View>
        <View style = {{top: '5%'}}>
            <Text style = {{marginLeft: '10%',width:'80%',textAlign: 'center',fontSize:30, fontFamily: Fonts.Montserrat}}>Каталог наград</Text>
        </View>
        <View style = {{backgroundColor: Colors.yellowDarkness, borderRadius: 20, height: '90%', marginTop: '15%', width: '90%', marginLeft: '5%'}}>
        <FlatList style = {{ left: '3%',margin: '10%'}} showsVerticalScrollIndicator = {false} data = {photos}
          numColumns={3}
          renderItem = {({item, index}) =>
          (
          <View style = {{flex:1, aspectRatio: 1}}>
            <View>
              <Pressable onPress={() => setSelectedIndex(index)}>
                <Image 
                  key = {index}
                  source = {item}
                  style = {{width: '80%', height: '90%', borderRadius: 15, borderWidth: 1}}
                />
              </Pressable>
              <Modal animationType = "fade"
                transparent={true}
                visible = {selectedIndex === index}
                onRequestClose={() => {
                setModalVisible(!modalVisible);
                }}>
                  <View style = {styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style = {{color: Colors.black, fontSize: 36, fontFamily: Fonts.MontserratBold}}>
                        Награда {index + 1}
                      </Text>
                      <Image 
                        key = {index}
                        source = {item}
                        style = {{width: '50%', height: '30%', borderRadius: 15, borderWidth: 1}}
                      />
                      <View>
                        <View style = {{borderBottomWidth: 1, width: '80%',marginTop: 10}}>
                          <Text style = {{fontFamily: Fonts.Montserrat}}>Стоимость: {cost[index]} баллов</Text>
                        </View>
                        <Text style = {{fontSize: 18, fontFamily: Fonts.MontserratBold, top: '5%', left: '2%'}}>
                          Описание
                        </Text>
                        <View style = {{height: '55%'}}>
                          <ScrollView style = {styles.scrollView}>
                            <Text style ={{marginHorizontal: 10, fontSize: 16, fontFamily: Fonts.Montserrat}}>
                              {description[index] || 'Описание отсутствует'}
                            </Text>
                          </ScrollView>
                        </View>
                      </View>
                      <View style = {{bottom: '18%', flexDirection: 'row'}}>
                        <Pressable style={{borderColor: Colors.black, borderWidth: 1, backgroundColor: Colors.yellowLight, borderRadius: 20, padding: 10}}
                        onPress = {() => setSelectedIndex(null)}>
                          <Text style={{fontSize: 14, fontFamily: Fonts.Montserrat , color: Colors.black}}>Закрыть окно</Text>
                        </Pressable>
                        <Pressable style={{marginLeft: 10,borderColor: Colors.black, borderWidth: 1, backgroundColor: Colors.yellowLight, borderRadius: 20, padding: 10}}
                        onPress = {() => setSelectedIndex(null)}>
                          <Text style={{fontSize: 14, fontFamily: Fonts.Montserrat , color: Colors.black}}>Запросить награду</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Modal>
            </View>
            <View>
              <Text style = {{marginLeft: '10%', bottom: '100%'}}>
                Награда {index + 1}
              </Text>
            </View>
          </View>
          )}
        />
        </View>
      </View>
    </View>
  )
}

export default CatalogScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.white,
      alignItems: 'center',
      marginTop: '10%',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      margin: 20,
      width: '80%',
      height: '70%',
      backgroundColor: Colors.yellowDarkness,
      borderRadius: 20,
      padding: 35,
      borderWidth: 2,
      alignItems: 'center',
    },
    button: {
      borderRadius: 20,
      padding: 10,
    },
    scrollView: {
      width: '95%',
      margin: 20,
      alignSelf: 'center',
      borderWidth: 2,
      borderRadius: 5,
      borderWidth: 1,
      backgroundColor: Colors.yellowLight,
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
      height:"45%",
      borderRadius: 100,
    },
    buttonContainer:{
      borderRadius: 50,
      width: '95%',
      alignItems: 'center',
      justifyContent: 'center',
    },
})