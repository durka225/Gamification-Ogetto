import {
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { Fonts } from '../../assets/fonts/Fonts';
import Colors from '../../assets/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RewardsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [rewardList, setRewardList] = useState([]);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [activeImages, setActiveImages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
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

  const confirmDeleteReward = (index) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const openImageModal = (images) => {
    setActiveImages(images);
    setImageModalVisible(true);
  };

  const handleDeleteReward = async () => {
    if (selectedIndex !== null) {
      const reward = rewardList[selectedIndex];
      try {
        const token = await AsyncStorage.getItem('accessToken');
        await axios.delete(`http://***/api/rewards/${reward.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const response = await axios.get('http://***/api/rewards');
        const serverRewards = response.data.map((reward) => ({
          id: reward.id.toString(),
          name: reward.title,
          description: reward.description,
          points: reward.cost,
          category: reward.category,
          count: reward.count,
          images: [],
        }));
        setRewardList(serverRewards);
        Alert.alert('Успех', 'Награда успешно удалена');
      } catch (error) {
        console.error('Ошибка при удалении награды:', error);
        Alert.alert('Ошибка', 'Не удалось удалить награду');
      }
    }
    setModalVisible(false);
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

  const fetchRewards = useCallback(async () => {
    try {
      const response = await axios.get('http://***/api/rewards');
      const serverRewards = response.data.map((reward) => ({
        id: reward.id.toString(),
        name: reward.title,
        description: reward.description,
        points: reward.cost,
        category: reward.category,
        count: reward.count,
        images: [],
      }));
      setRewardList(serverRewards);
    } catch (error) {
      console.error('Ошибка загрузки наград:', error);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRewards();
    setRefreshing(false);
  }, [fetchRewards]);

  useFocusEffect(
    useCallback(() => {
      fetchRewards();
    }, [fetchRewards])
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.headerIcon}>
          <Image source={require('../../assets/images/menuButton.png')} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Список наград</Text>
        {canEditContent && (
          <TouchableOpacity onPress={() => navigation.navigate("AddReward")} style={styles.headerIcon}>
            <Image source={require('../../assets/images/newCategory.png')} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={rewardList}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.rewardContainer}>
            {/* <TouchableOpacity onPress={() => openImageModal(item.images || [])}>
              <Image
                source={
                  item.images && item.images.length > 0
                    ? { uri: item.images[0] }
                    : require('../../assets/images/photoPlaceholder.png')
                }
                style={styles.image}
              />
            </TouchableOpacity> */}
            <View style={styles.textContainer}>
              <Text style={styles.rewardTitle}>{item.name}</Text>
              <Text style={styles.rewardPoints}>{item.points} баллов</Text>
              <Text style={styles.rewardCategory}>Категория: {item.category || '—'}</Text>
              {item.description ? (
                <Text style={styles.rewardCategory}>Описание: {item.description}</Text>
              ) : null}
              {item.count !== undefined ? (
                <Text style={styles.rewardCategory}>Доступно: {item.count}</Text>
              ) : null}
            </View>
            {/* Вертикальная полоска и иконки */}
            {canEditContent && (
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('EditReward', { reward: item })}>
                  <Image source={require('../../assets/images/comp1.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDeleteReward(index)}>
                  <Image source={require('../../assets/images/comp3.png')} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.yellowLight]}
          />
        }
      />

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Подтверждение</Text>
            <Text style={styles.modalMessage}>
              Вы действительно хотите удалить выбранную награду без возможности восстановления?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteReward} style={styles.confirmButton}>
                <Text style={styles.buttonText}>Подтвердить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={imageModalVisible}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
          <TouchableOpacity onPress={() => setImageModalVisible(false)} style={{ padding: 20 }}>
            <Image source={require('../../assets/images/backIcon.png')} />
          </TouchableOpacity>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
          >
            {activeImages.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={{
                  width: 300,
                  height: 300,
                  marginHorizontal: 20,
                  borderRadius: 15,
                  resizeMode: 'cover',
                }}
              />
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default RewardsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
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
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.yellowLight,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: Colors.white,
    minHeight: 90, // гарантируем минимальную высоту для полоски
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  rewardTitle: {
    fontSize: 18,
    fontFamily: Fonts.Montserrat,
  },
  rewardPoints: {
    fontSize: 14,
    color: Colors.gray,
  },
  image: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
  },
  rewardCategory: {
    fontSize: 13,
    color: Colors.gray,
    fontFamily: Fonts.Montserrat,
    marginTop: 2,
  },
  iconContainer: {
    height: '100%',
    alignItems: 'center', // центрируем по горизонтали
    paddingHorizontal: 10,
    position: 'relative',
    minHeight: 90,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  iconsWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: 12, // если не поддерживается, используйте marginBottom у первой кнопки
    alignSelf: 'center',
  },
  verticalLine: {
    position: 'absolute',
    left: 0, // полоска теперь слева от иконок
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: Colors.yellowLight,
    borderRadius: 1,
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
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: Fonts.MontserratBold,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: Fonts.Montserrat,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
  backButton: {
    marginLeft: 10,
    marginTop: 10,
  },
  backButton2: {
    marginRight: 10,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
});
