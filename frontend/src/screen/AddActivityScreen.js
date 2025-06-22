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
  ScrollView,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Colors from '../../assets/Colors';
import { Fonts } from '../../assets/fonts/Fonts';
import axios from 'axios';
import { fetchActivityCategories } from '../../assets/Data';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_IMAGES = 3;

const AddActivityScreen = () => {
  const navigation = useNavigation();
  const [activityName, setActivityName] = useState('');
  const [images, setImages] = useState([null]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [reward, setReward] = useState('');
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date(Date.now() + 86400000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState('start');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeInput, setTimeInput] = useState({ hours: '00', minutes: '00' });

  const validateDateTime = (date) => {
    const now = new Date();
    return date > now;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://***/api/activity/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке категорий активностей:', error);
      }
    };
    fetchCategories();
  }, []);

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Ошибка', 'Нужен доступ к галерее для выбора фото');
        }
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setActivityName('');
      setImages([null]);
      setSelectedCategory(null);
    }, [])
  );

  const handleSaveActivity = async () => {
    if (!activityName.trim() || !selectedCategory || !reward) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    if (!validateDateTime(dateStart)) {
      Alert.alert('Ошибка', 'Дата и время начала должны быть в будущем');
      return;
    }

    if (dateStart >= dateEnd) {
      Alert.alert('Ошибка', 'Дата и время окончания должны быть позже даты начала');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Ошибка', 'Необходима авторизация');
        return;
      }

      const newActivity = {
        title: activityName,
        reward: parseInt(reward),
        category_id: selectedCategory.id,
        dateStart: dateStart.toISOString(),
        dateEnd: dateEnd.toISOString(),
      };

      const response = await axios.post(
        'http://***/api/activity/add',
        newActivity,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );
      
      Alert.alert('Успех', 'Активность успешно добавлена');
      navigation.navigate('Activity', { newActivity: true });
    } catch (error) {
      console.error('Error creating activity:', error.response?.data || error.message);
      Alert.alert('Ошибка', 'Произошла ошибка при добавлении активности');
    }
  };

  const handleSelectImage = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      const newImages = [...images];
      newImages[index] = selectedUri;
      setImages(newImages);
    }
  };

  const handleAddImageSlot = () => {
    if (images.length < MAX_IMAGES) {
      setImages([...images, null]);
    }
  };

  const handleRemoveImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    if (updated.length === 0) updated.push(null);
    setImages(updated);
  };

  const generateDateList = (startDate = new Date()) => {
    const dates = [];
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const generateTimeList = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        times.push({
          hour,
          minute,
          label: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        });
      }
    }
    return times;
  };

  const handleDateSelect = (date) => {
    const selectedDate = datePickerType === 'start' ? dateStart : dateEnd;
    const newDate = new Date(date);
    newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());

    if (datePickerType === 'start') {
      setDateStart(newDate);
    } else {
      setDateEnd(newDate);
    }
    setShowDatePicker(false);
    
    setTimeInput({
      hours: newDate.getHours().toString().padStart(2, '0'),
      minutes: newDate.getMinutes().toString().padStart(2, '0')
    });
    setShowTimePicker(true);
  };

  const handleTimeInput = (type, value) => {
    let newValue = value.replace(/[^0-9]/g, '');
    
    if (type === 'hours') {
      newValue = Math.min(Math.max(0, parseInt(newValue) || 0), 23).toString().padStart(2, '0');
      setTimeInput(prev => ({ ...prev, hours: newValue }));
    } else {
      newValue = Math.min(Math.max(0, parseInt(newValue) || 0), 59).toString().padStart(2, '0');
      setTimeInput(prev => ({ ...prev, minutes: newValue }));
    }
  };

  const handleTimeConfirm = () => {
    const hours = parseInt(timeInput.hours);
    const minutes = parseInt(timeInput.minutes);
    
    const newDate = datePickerType === 'start' ? new Date(dateStart) : new Date(dateEnd);
    newDate.setHours(hours, minutes, 0, 0);

    if (datePickerType === 'start') {
      setDateStart(newDate);
      if (dateEnd <= newDate) {
        const newEndDate = new Date(newDate);
        newEndDate.setHours(newDate.getHours() + 1);
        setDateEnd(newEndDate);
      }
    } else {
      setDateEnd(newDate);
    }
    setShowTimePicker(false);
  };

  const showDatePickerModal = (type) => {
    setDatePickerType(type);
    setShowDatePicker(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../../assets/images/backIcon.png')} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerText}>Добавление активности</Text>
        </View>
      </View>
      <View style={styles.fieldsContainer}>
        <TextInput
          style={styles.input}
          placeholder="Название активности"
          placeholderTextColor={Colors.gray}
          value={activityName}
          onChangeText={setActivityName}
        />

        <TextInput
          style={styles.input}
          placeholder="Награда (баллы)"
          placeholderTextColor={Colors.gray}
          value={reward}
          onChangeText={setReward}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
        >
          <Text style={{ color: selectedCategory ? Colors.black : Colors.gray }}>
            {selectedCategory ? selectedCategory.category : 'Категория активности'}
          </Text>
        </TouchableOpacity>

        {showCategoryDropdown && (
          <View style={styles.dropdown}>
            {categories.map((categoryObj) => (
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
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => showDatePickerModal('start')}
        >
          <Text style={styles.dateText}>
            Начало: {dateStart.toLocaleDateString()} {dateStart.toLocaleTimeString().substring(0, 5)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => showDatePickerModal('end')}
        >
          <Text style={styles.dateText}>
            Окончание: {dateEnd.toLocaleDateString()} {dateEnd.toLocaleTimeString().substring(0, 5)}
          </Text>
        </TouchableOpacity>

        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.datePickerContainer}>
              <Text style={styles.datePickerTitle}>
                {datePickerType === 'start' ? 'Выберите дату начала' : 'Выберите дату окончания'}
              </Text>
              <ScrollView style={styles.dateList}>
                {generateDateList(datePickerType === 'end' ? dateStart : new Date()).map((date) => (
                  <TouchableOpacity
                    key={date.toISOString()}
                    style={styles.dateItem}
                    onPress={() => handleDateSelect(date)}
                  >
                    <Text style={styles.dateItemText}>{date.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showTimePicker} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.datePickerContainer}>
              <Text style={styles.datePickerTitle}>
                Введите время {datePickerType === 'start' ? 'начала' : 'окончания'}
              </Text>
              <View style={styles.timeInputContainer}>
                <TextInput
                  style={styles.timeInput}
                  value={timeInput.hours}
                  onChangeText={(value) => handleTimeInput('hours', value)}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="00"
                />
                <Text style={styles.timeColon}>:</Text>
                <TextInput
                  style={styles.timeInput}
                  value={timeInput.minutes}
                  onChangeText={(value) => handleTimeInput('minutes', value)}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="00"
                />
              </View>
              <View style={styles.timeButtonsContainer}>
                <TouchableOpacity
                  style={[styles.timeButton, { backgroundColor: '#eee' }]}
                  onPress={() => setShowTimePicker(false)}
                >
                  <Text style={styles.timeButtonText}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.timeButton, { backgroundColor: Colors.yellowLight }]}
                  onPress={handleTimeConfirm}
                >
                  <Text style={styles.timeButtonText}>Подтвердить</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveActivity}>
        <Text style={styles.saveButtonText}>СОХРАНИТЬ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddActivityScreen;

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
  dateInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    paddingVertical: 10,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    fontFamily: Fonts.Montserrat,
    color: Colors.black,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    backgroundColor: Colors.white,
    width: '80%',
    maxHeight: '70%',
    borderRadius: 10,
    padding: 20,
  },
  datePickerTitle: {
    fontSize: 18,
    fontFamily: Fonts.MontserratBold,
    textAlign: 'center',
    marginBottom: 15,
  },
  dateList: {
    maxHeight: 300,
  },
  dateItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  dateItemText: {
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
  cancelButtonText: {
    fontSize: 16,
    fontFamily: Fonts.Montserrat,
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 5,
    padding: 10,
    width: 60,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: Fonts.Montserrat,
  },
  timeColon: {
    fontSize: 24,
    marginHorizontal: 10,
    fontFamily: Fonts.Montserrat,
  },
  timeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  timeButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 14,
    fontFamily: Fonts.Montserrat,
  },
});
