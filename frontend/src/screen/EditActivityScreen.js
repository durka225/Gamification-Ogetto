import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, Modal, ScrollView, Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Colors from '../../assets/Colors';
import { Fonts } from '../../assets/fonts/Fonts';

const EditActivityScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { activity } = route.params;

  const [title, setTitle] = useState(activity.title);
  const [reward, setReward] = useState(activity.reward.toString());
  const [startDate, setStartDate] = useState(new Date(activity.dateStart));
  const [endDate, setEndDate] = useState(new Date(activity.dateEnd));
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(activity.category);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://***/api/activity/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://***/api/activity/change/${activity.id}`,
        {
          title,
          reward: parseInt(reward),
          category_id: selectedCategory.id,
          dateStart: startDate.toISOString(),
          dateEnd: endDate.toISOString()
        }
      );

      if (response.status === 200) {
        Alert.alert('Успех', 'Активность успешно обновлена');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить активность');
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const generateDateArray = () => {
    const dates = [];
    const start = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../../assets/images/backIcon.png')} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerText}>Редактирование активности</Text>
        </View>
      </View>
      
      <View style={styles.fieldsContainer}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Название активности"
          placeholderTextColor={Colors.gray}
        />

        <TextInput
          style={styles.input}
          value={reward}
          onChangeText={setReward}
          placeholder="Награда"
          keyboardType="numeric"
          placeholderTextColor={Colors.gray}
        />

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={{ color: selectedCategory ? Colors.black : Colors.gray }}>
            {selectedCategory?.category || 'Выберите категорию'}
          </Text>
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

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text>Дата начала: {formatDate(startDate)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text>Дата окончания: {formatDate(endDate)}</Text>
        </TouchableOpacity>

        <Modal
          visible={showStartDatePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <Text style={styles.modalTitle}>Выберите дату начала</Text>
              <ScrollView style={styles.dateList}>
                {generateDateArray().map((date) => (
                  <TouchableOpacity
                    key={date.toISOString()}
                    style={styles.dateItem}
                    onPress={() => {
                      setStartDate(date);
                      setShowStartDatePicker(false);
                    }}
                  >
                    <Text style={styles.dateText}>{formatDate(date)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowStartDatePicker(false)}
              >
                <Text style={styles.buttonText}>Отмена</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showEndDatePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <Text style={styles.modalTitle}>Выберите дату окончания</Text>
              <ScrollView style={styles.dateList}>
                {generateDateArray().map((date) => (
                  <TouchableOpacity
                    key={date.toISOString()}
                    style={styles.dateItem}
                    onPress={() => {
                      setEndDate(date);
                      setShowEndDatePicker(false);
                    }}
                  >
                    <Text style={styles.dateText}>{formatDate(date)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowEndDatePicker(false)}
              >
                <Text style={styles.buttonText}>Отмена</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>СОХРАНИТЬ</Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginTop: 40,
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.MontserratBold,
    marginBottom: 15,
    textAlign: 'center',
  },
  dateList: {
    maxHeight: 300,
  },
  dateItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  dateText: {
    fontSize: 16,
    fontFamily: Fonts.Montserrat,
  },
  cancelButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: Colors.yellowLight,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: Fonts.Montserrat,
    fontSize: 16,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: Colors.white,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: Fonts.Montserrat,
  },
});

export default EditActivityScreen;
