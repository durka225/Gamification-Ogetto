import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Colors from '../../assets/Colors';
import { Fonts } from '../../assets/fonts/Fonts';

const EditCategoryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category, type } = route.params;

  const [name, setName] = useState(category.category);
  const [description, setDescription] = useState(category.description || '');

  const handleSave = async () => {
    try {
      const endpoint = type === 'reward' 
        ? `http://***/api/rewards/category/${category.id}`
        : `http://***/api/activity/category/${category.id}`;

      const data = type === 'reward'
        ? { category: name, description }
        : { nameCategory: name };

      const response = await axios.put(endpoint, data);

      if (response.status === 200) {
        Alert.alert('Успех', 'Категория успешно обновлена');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить категорию');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../../assets/images/backIcon.png')} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerText}>Редактирование категории</Text>
        </View>
      </View>

      <View style={styles.fieldsContainer}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Название категории"
        />

        {type === 'reward' && (
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Описание категории"
            multiline
          />
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
    borderBottomColor: Colors.gray,
    fontSize: 16,
    fontFamily: Fonts.Montserrat,
    marginBottom: 20,
    paddingVertical: 5,
  },
  saveButton: {
    backgroundColor: Colors.yellowLight,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: '65%',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
  },
});

export default EditCategoryScreen;
