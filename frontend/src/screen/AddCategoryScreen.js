import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Colors from '../../assets/Colors';
import { Fonts } from '../../assets/fonts/Fonts';
import axios from 'axios';

const AddCategoryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert('Ошибка', 'Введите название категории');
      return;
    }

    try {
      await axios.post(
        'http://***/api/rewards/newCategory',
        { category: categoryName.trim() },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      navigation.navigate('Categories');
    } catch (error) {
      console.error('Ошибка при добавлении категории:', error);
      Alert.alert('Ошибка', 'Не удалось добавить категорию');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../../assets/images/backIcon.png')} />
      </TouchableOpacity>
      <Text style={styles.headerText}>Добавление категории</Text>
      <TextInput
        style={styles.input}
        placeholder="Название категории"
        placeholderTextColor={Colors.gray}
        value={categoryName}
        onChangeText={setCategoryName}
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Описание награды"
        placeholderTextColor={Colors.gray}
        value={categoryDescription}
        onChangeText={setCategoryDescription}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveCategory}>
        <Text style={styles.saveButtonText}>СОХРАНИТЬ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddCategoryScreen;

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
    marginBottom: '35%',
    marginTop: '10%',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    fontSize: 16,
    fontFamily: Fonts.Montserrat,
    marginBottom: 20,
    paddingVertical: 5,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
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
