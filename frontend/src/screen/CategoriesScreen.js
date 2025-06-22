import { FlatList, TouchableOpacity, StyleSheet, Text, View, Image, Modal, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../assets/fonts/Fonts';
import Colors from '../../assets/Colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CategoryListScreen = () => {
  const navigation = useNavigation();

  const [categoryList, setCategoryList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return;
        const response = await axios.get('http://***/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    };
    fetchUser();
  }, []);

  const canEditContent = userData?.role === 'admin' || userData?.role === 'manager';

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://***/api/rewards/category');
      setCategoryList(response.data || []);
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCategories();
    });
    return unsubscribe;
  }, [navigation]);

  const confirmDeleteCategory = (index) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const handleDeleteCategory = async () => {
    if (selectedIndex !== null) {
      const category = categoryList[selectedIndex];
      try {
        const token = await AsyncStorage.getItem('accessToken');
        await axios.delete(`http://***/api/rewards/category/${category.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchCategories();
        Alert.alert('Успех', 'Категория успешно удалена');
      } catch (error) {
        console.error('Ошибка при удалении категории:', error);
        Alert.alert('Ошибка', 'Не удалось удалить категорию. Возможно она используется в наградах.');
      }
    }
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.headerIcon}>
          <Image source={require('../../assets/images/menuButton.png')} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Список категорий</Text>
        {canEditContent && (
          <TouchableOpacity onPress={() => navigation.navigate("AddCategory")} style={styles.headerIcon}>
            <Image source={require('../../assets/images/newCategory.png')} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.listContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={categoryList}
          keyExtractor={(item) => item.id?.toString() || ''}
          renderItem={({ item, index }) => (
            <View style={styles.categoryContainer}>
              <View style={styles.categoryContent}>
                <Text style={styles.categoryTitle}>{item.category}</Text>
                <View style={styles.separator} />
                <Text style={styles.descriptionLabel}>Описание:</Text>
                <Text style={styles.categoryDescription}>
                  {item.description || 'Описание отсутствует'}
                </Text>
              </View>
              {canEditContent && (
                <View style={styles.iconContainer}>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('EditCategory', { 
                      category: item,
                      type: 'reward'
                    })}
                  >
                    <Image source={require('../../assets/images/comp1.png')} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmDeleteCategory(index)} style={{ marginTop: 12 }}>
                    <Image source={require('../../assets/images/comp3.png')} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      </View>

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Подтверждение</Text>
            <Text style={styles.modalMessage}>
              Вы действительно хотите удалить выбранную категорию без возможности восстановления?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteCategory} style={styles.confirmButton}>
                <Text style={styles.buttonText}>Подтвердить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CategoryListScreen;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: Colors.white,
  },
  headerIcon: {
    padding: 6,
  },
  headerText: {
    fontSize: 19,
    fontFamily: Fonts.Montserrat,
    textAlign: 'center',
    flex: 1,
  },
  listContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    padding: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderColor: Colors.yellowLight,
    borderRadius: 15,
    borderWidth: 3,
    marginVertical: 5,
    alignItems: 'stretch',
  },
  categoryContent: {
    flex: 1,
    paddingRight: 10,
  },
  categoryTitle: {
    fontSize: 15,
    fontFamily: Fonts.MontserratBold,
    paddingVertical: 5,
    textAlign: 'center',
  },
  separator: {
    height: 2,
    width: '105%',
    backgroundColor: Colors.yellowLight,
    marginVertical: 3,
  },
  descriptionLabel: {
    fontSize: 13,
    fontFamily: Fonts.MontserratBold,
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: 10,
    fontFamily: Fonts.Montserrat,
    color: Colors.black,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    borderLeftWidth: 3,
    padding: 15,
    borderColor: Colors.yellowLight,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: Fonts.MontserratBold,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 15,
    fontFamily: Fonts.Montserrat,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    padding: 5,
    borderRadius: 10,
    marginLeft: "26%",
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    padding: 5,
    borderRadius: 10,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontFamily: Fonts.Montserrat,
    color: Colors.black,
  },
});
