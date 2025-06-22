import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Colors from '../../assets/Colors';
import { Fonts } from '../../assets/fonts/Fonts';

const EditRewardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { reward } = route.params;

  console.log('Received reward data:', reward); 

  const [title, setTitle] = useState(reward.name || ''); 
  const [description, setDescription] = useState(reward.description || '');
  const [cost, setCost] = useState(reward.points?.toString() || '0'); 
  const [count, setCount] = useState(reward.count?.toString() || '0');
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({
    id: reward.category_id,
    category: reward.category
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://***/api/rewards/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !selectedCategory) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните обязательные поля');
      return;
    }

    try {
      const response = await axios.put(
        `http://***/api/rewards/${reward.id}`,
        {
          title,
          description,
          categoryId: selectedCategory.id,
          cost: parseInt(cost) || 0,
          count: parseInt(count) || 0
        }
      );

      if (response.status === 200) {
        Alert.alert('Успех', 'Награда успешно обновлена');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Update error:', error.response?.data || error);
      Alert.alert('Ошибка', 'Не удалось обновить награду');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../../assets/images/backIcon.png')} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerText}>Редактирование награды</Text>
        </View>
      </View>

      <View style={styles.fieldsContainer}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Название награды"
        />

        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Описание"
          multiline
        />

        <TextInput
          style={styles.input}
          value={cost}
          onChangeText={setCost}
          placeholder="Стоимость"
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          value={count}
          onChangeText={setCount}
          placeholder="Количество"
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text>{selectedCategory?.category || 'Выберите категорию'}</Text>
        </TouchableOpacity>

        {showDropdown && (
          <View style={styles.dropdown}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedCategory(cat);
                  setShowDropdown(false);
                }}
              >
                <Text>{cat.category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>СОХРАНИТЬ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontFamily: Fonts.MontserratBold,
    textAlign: 'center',
  },
  fieldsContainer: {
    marginTop: 40,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: Colors.gray,
    padding: 10,
    marginBottom: 20,
    fontFamily: Fonts.Montserrat,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 5,
    marginTop: -15,
    marginBottom: 20,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: Colors.gray,
  },
  saveButton: {
    backgroundColor: Colors.yellowLight,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 40,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
  },
});

export default EditRewardScreen;
