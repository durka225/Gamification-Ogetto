import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Colors from '../../assets/Colors';
import { Fonts } from '../../assets/fonts/Fonts';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const MAX_IMAGES = 3;

const AddRewardScreen = () => {
  const navigation = useNavigation();

  const [rewardName, setRewardName] = useState('');
  const [rewardDescription, setRewardDescription] = useState('');
  const [rewardPoints, setRewardPoints] = useState('');
  const [rewardCount, setRewardCount] = useState('1'); 
  const [categories, setCategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://***/api/rewards/category');
        setCategories(response.data || []);
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      }
    };
    fetchCategories();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setRewardName('');
      setRewardDescription('');
      setRewardPoints('');
      setRewardCount('1');
      setSelectedCategory(null);
    }, [])
  );

  const handleSaveReward = async () => {
    if (!rewardName.trim() || !rewardDescription.trim() || !rewardPoints.trim() || !selectedCategory || !rewardCount.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    const rewardData = {
      title: rewardName,
      description: rewardDescription,
      categoryId: selectedCategory.id,
      cost: parseInt(rewardPoints, 10),
      count: parseInt(rewardCount, 10),
    };

    try {
      const response = await axios.post('http://***/api/rewards/add', rewardData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      Alert.alert('Успех', 'Награда успешно добавлена');
      navigation.goBack();
    } catch (error) {
      console.error('Ошибка при добавлении награды:', error);
      Alert.alert('Ошибка', 'Не удалось добавить награду');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../../assets/images/backIcon.png')} />
      </TouchableOpacity>

      <Text style={styles.headerText}>Добавление награды</Text>

      <TextInput
        style={styles.input}
        placeholder="Название награды"
        placeholderTextColor={Colors.gray}
        value={rewardName}
        onChangeText={setRewardName}
      />
      <TextInput
        style={styles.input}
        placeholder="Краткое описание награды"
        placeholderTextColor={Colors.gray}
        value={rewardDescription}
        onChangeText={setRewardDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Стоимость награды в баллах"
        placeholderTextColor={Colors.gray}
        keyboardType="numeric"
        value={rewardPoints}
        onChangeText={setRewardPoints}
      />
      <TextInput
        style={styles.input}
        placeholder="Количество наград"
        placeholderTextColor={Colors.gray}
        keyboardType="numeric"
        value={rewardCount}
        onChangeText={setRewardCount}
      />

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
      >
        <Text style={{ color: selectedCategory ? Colors.black : Colors.gray }}>
          {selectedCategory ? selectedCategory.category : 'Категория награды'}
        </Text>
      </TouchableOpacity>

      {showCategoryDropdown && (
        <View style={styles.dropdown}>
          {categories.length === 0 ? (
            <Text style={styles.dropdownText}>Нет доступных категорий</Text>
          ) : (
            categories.map((categoryObj) => (
              <TouchableOpacity
                key={categoryObj.id}
                onPress={() => {
                  setSelectedCategory(categoryObj);
                  setShowCategoryDropdown(false);
                }}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownText}>{categoryObj.category}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveReward}>
        <Text style={styles.saveButtonText}>СОХРАНИТЬ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddRewardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backButton: {
    marginTop: 10,
    marginLeft: 10,
  },
  headerText: {
    fontSize: 20,
    fontFamily: Fonts.MontserratBold,
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    fontSize: 16,
    fontFamily: Fonts.Montserrat,
    marginBottom: 20,
    paddingVertical: 5,
  },
  dropdown: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray,
    marginBottom: 20,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  dropdownText: {
    fontFamily: Fonts.Montserrat,
    fontSize: 16,
  },
  saveButton: {
    marginTop: "65%",
    backgroundColor: Colors.yellowLight,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
  },
});
