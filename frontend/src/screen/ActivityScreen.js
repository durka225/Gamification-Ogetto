import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  Image,
  Modal,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Fonts } from '../../assets/fonts/Fonts';
import Colors from '../../assets/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ActivityScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [activityList, setActivityList] = useState([]);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchActivities = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get('http://***/api/activity');
      const activities = response.data;

      activities.forEach(async (activity) => {
        const endDate = new Date(activity.dateEnd);
        const now = new Date();
        
        if (endDate < now && activity.users?.some(user => user.id === userData?.id)) {
          try {
            const pointsRequest = {
              points: activity.reward,
              description: `Завершение активности: ${activity.title}`,
              reward: activity.id
            };

            await axios.post(
              'http://***/api/points/add',
              pointsRequest,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
          } catch (error) {
            console.log('Points request error:', error);
          }
        }
      });

      setActivityList(activities);
    } catch (error) {
      console.error('Ошибка при загрузке активностей:', error);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, []);

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

  useFocusEffect(
    useCallback(() => {
      fetchActivities();
    }, [fetchActivities])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchActivities();
    setRefreshing(false);
  }, [fetchActivities]);

  const confirmDeleteActivity = (index) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const handleDeleteActivity = async () => {
    if (selectedIndex !== null) {
      const activity = activityList[selectedIndex];
      try {
        const token = await AsyncStorage.getItem('accessToken');
        await axios.delete(`http://***/api/activity/${activity.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchActivities();
        Alert.alert('Успех', 'Активность успешно удалена');
      } catch (error) {
        console.error('Ошибка при удалении активности:', error);
        Alert.alert('Ошибка', 'Не удалось удалить активность');
      }
    }
    setModalVisible(false);
  };

  const handleJoinActivity = async (activity) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Ошибка', 'Необходима авторизация');
        return;
      }

      if (activity.users?.some(user => user.id === userData.id)) {
        Alert.alert('Ошибка', 'Вы уже участвуете в этой активности');
        return;
      }

      const userResponse = await axios.get('http://***/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const response = await axios.post(
        `http://***/api/user/${userResponse.data.id}/activities/${activity.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Alert.alert('Успех', 'Вы успешно присоединились к активности');
      fetchActivities();

    } catch (error) {
      console.error('Join error:', error.response?.data);
      let errorMessage = 'Не удалось присоединиться к активности';

      if (error.response && error.response.status === 400) {
        errorMessage = 'Активность уже началась';
      }

      Alert.alert('Ошибка', errorMessage);
    }
  };

  const renderActivityStatus = (activity) => {
    const now = new Date();
    const startDate = new Date(activity.dateStart);
    const endDate = new Date(activity.dateEnd);

    if (now < startDate) {
      return <Text style={[styles.statusText, { color: '#2196F3' }]}>Ожидается</Text>;
    } else if (now > endDate) {
      return <Text style={[styles.statusText, { color: '#4CAF50' }]}>Завершено</Text>;
    } else {
      return <Text style={[styles.statusText, { color: '#FF9800' }]}>Активно</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.headerIcon}>
          <Image source={require('../../assets/images/menuButton.png')} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Список активностей</Text>
        {canEditContent && (
          <TouchableOpacity onPress={() => navigation.navigate("AddActivity")} style={styles.headerIcon}>
            <Image source={require('../../assets/images/newCategory.png')} />
          </TouchableOpacity>
        )}
        {!canEditContent && <View style={{ width: 30 }} />}
      </View>
      <FlatList
        data={activityList}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.yellowLight]}
          />
        }
        renderItem={({ item, index }) => (
          <View style={styles.activityContainer}>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Награда: {item.reward} баллов</Text>
                <Text style={styles.infoText}>Категория: {item.category?.category || 'Нет категории'}</Text>
                <Text style={styles.infoText}>
                  Начало: {new Date(item.dateStart).toLocaleDateString()}
                </Text>
                <Text style={styles.infoText}>
                  Окончание: {new Date(item.dateEnd).toLocaleDateString()}
                </Text>
                <Text style={styles.infoText}>
                  Участников: {item.users?.length || 0}
                </Text>
                {renderActivityStatus(item)}
              </View>
              {new Date() < new Date(item.dateStart) && (
                <TouchableOpacity 
                  style={styles.joinButton}
                  onPress={() => handleJoinActivity(item)}
                >
                  <Text style={styles.joinButtonText}>Присоединиться</Text>
                </TouchableOpacity>
              )}
            </View>
            {canEditContent && (
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('EditActivity', { activity: item })}>
                  <Image source={require('../../assets/images/comp1.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDeleteActivity(index)}>
                  <Image source={require('../../assets/images/comp3.png')} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Подтверждение</Text>
            <Text style={styles.modalMessage}>
              Вы действительно хотите удалить выбранную активность без возможности восстановления?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteActivity} style={styles.confirmButton}>
                <Text style={styles.buttonText}>Подтвердить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ActivityScreen;

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
  activityContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: Colors.yellowLight,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: '5%',
  },
  activityContent: {
    flex: 1,
    padding: 15,
  },
  activityTitle: {
    fontSize: 18,
    fontFamily: Fonts.MontserratBold,
    marginBottom: 10,
  },
  image: {
    width: 70,
    height: 70,
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  iconContainer: {
    height: 105,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
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
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontFamily: Fonts.Montserrat,
    color: Colors.black,
  },
  joinButton: {
    backgroundColor: Colors.yellowLight,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  joinButtonText: {
    fontFamily: Fonts.Montserrat,
    fontSize: 14,
    color: Colors.black,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 10,
  },
  infoText: {
    fontFamily: Fonts.Montserrat,
    fontSize: 14,
    marginVertical: 2,
    color: Colors.black,
  },
  statusText: {
    fontFamily: Fonts.MontserratBold,
    fontSize: 14,
    marginTop: 5,
  },
});
