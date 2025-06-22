import { ScrollView, Pressable, Modal, Image, FlatList, TouchableOpacity, StyleSheet, Text, View, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../assets/fonts/Fonts';
import Colors from '../../assets/Colors'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CatalogScreen = () => {
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState('cheap'); 
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [pendingRewardId, setPendingRewardId] = useState(null);

  const fetchRewards = async () => {
    try {
      const categoriesResponse = await axios.get('http://***/api/rewards/category');
      const categoryMap = {};
      categoriesResponse.data.forEach(cat => {
        categoryMap[cat.category] = cat.id;
      });

      const response = await axios.get('http://***/api/rewards');
      const normalized = (response.data || []).map((reward) => ({
        id: reward.id?.toString() ?? '',
        title: reward.title,
        description: reward.description,
        cost: reward.cost,
        categoryId: String(categoryMap[reward.category] || ''),
        categoryName: reward.category || 'Без категории'
      }));
      setRewards(normalized);
    } catch (error) {
      console.error('Ошибка при получении наград:', error);
      setRewards([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://***/api/rewards/category');
      setCategories(response.data || []);
    } catch (error) {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchRewards();
    fetchCategories();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchRewards();
      fetchCategories();
    });
    return unsubscribe;
  }, [navigation]);

  // Обновленная функция фильтрации
  const getFilteredRewards = () => {
    let filtered = [...rewards];
    
    if (selectedCategoryId) {
      filtered = filtered.filter(reward => 
        reward.categoryId === String(selectedCategoryId)
      );
    }

    if (sortOption === 'cheap') {
      filtered.sort((a, b) => (Number(a.cost) || 0) - (Number(b.cost) || 0));
    } else if (sortOption === 'expensive') {
      filtered.sort((a, b) => (Number(b.cost) || 0) - (Number(a.cost) || 0));
    }

    return filtered;
  };

  const handleRequestReward = async (rewardId) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Ошибка', 'Необходима авторизация');
        return;
      }
      const response = await axios.post(
        'http://***/api/rewards/createPoint',
        { idReward: rewardId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.id) {
        Alert.alert('Успех', 'Запрос на получение награды успешно создан');
      } else {
        Alert.alert('Ошибка', 'Не удалось создать запрос на получение награды');
      }
    } catch (error) {
      console.error('Ошибка при создании запроса на награду:', error);
      Alert.alert('Ошибка', 'Не удалось создать запрос на получение награды');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Image source={require('../../assets/images/menuButton.png')} />
        </TouchableOpacity>
        <Text style={styles.title}>Каталог наград</Text>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Image source={require('../../assets/images/filterIcon.png')} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={getFilteredRewards()}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item, index }) => (
          <View style={styles.cardWrapper}>
            <Pressable onPress={() => setSelectedIndex(index)} style={styles.card}>
              <Text style={styles.captionInside}>{item.title || `Награда ${index + 1}`}</Text>
            </Pressable>
            <Modal
              animationType="fade"
              transparent
              visible={selectedIndex === index}
              onRequestClose={() => setSelectedIndex(null)}
            >
              <TouchableOpacity
                activeOpacity={1}
                style={styles.centeredView}
                onPress={() => setSelectedIndex(null)}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.modalView}
                  onPress={() => {}}
                >
                  <Text style={styles.modalTitle}>{item.title || `Награда ${index + 1}`}</Text>
                  <Text style={styles.modalCost}>
                    Стоимость: {item.cost || 0} баллов
                  </Text>
                  <ScrollView style={styles.scrollView}>
                    <Text style={styles.modalDescription}>
                      {item.description || 'Описание отсутствует'}
                    </Text>
                  </ScrollView>
                  <Pressable
                    style={styles.getRewardButton}
                    onPress={() => {
                      setPendingRewardId(item.id);
                      setConfirmModalVisible(true);
                    }}
                  >
                    <Text style={styles.getRewardText}>ПОЛУЧИТЬ НАГРАДУ</Text>
                  </Pressable>
                </TouchableOpacity>
              </TouchableOpacity>
            </Modal>
          </View>
        )}
      />
      <Modal
        animationType="fade"
        transparent
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { padding: 24 }]}>
            <Text style={styles.modalTitle}>Подтверждение</Text>
            <Text style={{ fontSize: 16, textAlign: 'center', marginVertical: 10 }}>
              Вы действительно хотите получить эту награду? Баллы будут списаны.
            </Text>
            <TouchableOpacity
              style={[styles.getRewardButton, { backgroundColor: Colors.yellowLight, marginTop: 20 }]}
              onPress={async () => {
                setConfirmModalVisible(false);
                setSelectedIndex(null);
                if (pendingRewardId) {
                  await handleRequestReward(pendingRewardId);
                  setPendingRewardId(null);
                }
              }}
            >
              <Text style={styles.getRewardText}>Подтвердить</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.getRewardButton, { backgroundColor: '#eee', marginTop: 16 }]}
              onPress={() => setConfirmModalVisible(false)}
            >
              <Text style={[styles.getRewardText, { color: Colors.gray }]}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.filterModalOverlay}>
          <View style={styles.filterModal}>
            <Text style={styles.filterTitle}>Сортировка наград</Text>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => {
                setSortOption('cheap');
                setSelectedCategoryId(null);
              }}
            >
              <Text style={styles.filterOptionText}>Сначала дешевле</Text>
              <View style={styles.radioCircle}>
                {sortOption === 'cheap' && selectedCategoryId === null && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => {
                setSortOption('expensive');
                setSelectedCategoryId(null);
              }}
            >
              <Text style={styles.filterOptionText}>Сначала дороже</Text>
              <View style={styles.radioCircle}>
                {sortOption === 'expensive' && selectedCategoryId === null && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.filterOption}
                onPress={() => {
                  setSelectedCategoryId(cat.id);
                  setSortOption('category');
                }}
              >
                <Text style={styles.filterOptionText}>Категория: {cat.category}</Text>
                <View style={styles.radioCircle}>
                  {selectedCategoryId === cat.id && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => {
                setSelectedCategoryId(null);
                setSortOption('cheap');
              }}
            >
              <Text style={styles.filterOptionText}>Сбросить фильтр</Text>
              <View style={styles.radioCircle}>
                {!selectedCategoryId && sortOption === 'cheap' && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterApplyButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.filterApplyText}>ПРИМЕНИТЬ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default CatalogScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.Montserrat,
  },
  grid: {
    paddingBottom: 100,
  },
  cardWrapper: {
    width: '50%',
    marginVertical: 6,
  },
  
  card: {
    borderWidth: 2,
    borderColor: "#FFED00",
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    width: '70%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '10%',
    elevation: 6,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  
  image: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
    marginBottom: 8,
  },
  
  captionInside: {
    fontFamily: Fonts.Montserrat,
    fontSize: 13,
    textAlign: 'center',
    color: Colors.black,
  },
  
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: Fonts.MontserratBold,
    marginBottom: 10,
  },
  modalImage: {
    width: '60%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  modalCost: {
    fontFamily: Fonts.Montserrat,
    fontSize: 16,
  },
  scrollView: {
    maxHeight: 100,
    marginVertical: 10,
  },
  modalDescription: {
    fontSize: 16,
    fontFamily: Fonts.Montserrat,
  },
  getRewardButton: {
    marginTop: 20,
    backgroundColor: Colors.yellowLight,
    borderRadius: 25,
    padding: 12,
    width: '100%',
    alignItems: 'center',
  },
  getRewardText: {
    fontSize: 16,
    fontFamily: Fonts.Montserrat,
    color: Colors.black,
  },
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
    alignItems: 'stretch',
  },
  filterTitle: {
    fontSize: 18,
    fontFamily: Fonts.MontserratBold,
    textAlign: 'center',
    marginBottom: 18,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  filterOptionText: {
    fontSize: 16,
    fontFamily: Fonts.Montserrat,
    color: Colors.black,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.yellowLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.yellowLight,
  },
  filterApplyButton: {
    marginTop: 24,
    backgroundColor: Colors.yellowLight,
    borderRadius: 25,
    padding: 14,
    alignItems: 'center',
  },
  filterApplyText: {
    fontSize: 16,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
  },
});
