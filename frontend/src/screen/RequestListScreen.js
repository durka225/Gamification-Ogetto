import { FlatList, TouchableOpacity, StyleSheet, Text, View, Image, Modal, Alert, RefreshControl } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Fonts } from '../../assets/fonts/Fonts';
import Colors from '../../assets/Colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RequestListScreen = () => {
  const navigation = useNavigation();
  const [requestList, setRequestList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Ошибка', 'Необходима авторизация');
        return;
      }

      const response = await axios.get('http://***/api/points/myPoints', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequestList(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
      if (error.response?.status === 401) {
        Alert.alert('Ошибка', 'Необходима повторная авторизация');
      } else {
        Alert.alert('Ошибка', 'Не удалось загрузить заявки');
      }
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [])
  );

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleConfirmPoints = async (id) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Ошибка', 'Необходима авторизация');
        return;
      }
      
      await axios.post(
        `http://***/api/points/success/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Удаляем подтвержденный запрос из списка
      setRequestList(currentList => currentList.filter(request => request.id !== id));
      Alert.alert('Успех', 'Заявка подтверждена');
    } catch (error) {
      console.error('Ошибка при подтверждении заявки:', error);
      Alert.alert('Ошибка', 'Не удалось подтвердить заявку');
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'PENDING': 'В обработке',
      'APPROVED': 'Одобрено',
      'REJECTED': 'Отклонено'
    };
    return statusMap[status] || 'Неизвестно';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.backButton}>
          <Image source={require('../../assets/images/menuButton.png')} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>Мои заявки</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <FlatList
        data={requestList}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.yellowLight]}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.rewardContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.rewardTitle}>
                {item.idReward?.title || 'Заявка'}
              </Text>
              <Text style={[
                styles.reward,
                {
                  color: item.status === 'APPROVED' ? '#4CAF50' : 
                         item.status === 'REJECTED' ? '#F44336' : '#2196F3'
                }
              ]}>
                Статус: {getStatusText(item.status)}
              </Text>
              <Text style={styles.reward}>
                Пользователь: {item.login?.name || ''} {item.login?.surname || ''}
              </Text>
              <Text style={styles.reward}>
                Баллы: {item.points}
              </Text>
              <Text style={styles.reward}>
                Описание: {item.description}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default RequestListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 25,
    justifyContent: 'space-between',
  },
  backButton: {
    marginLeft: 10,
    marginTop: 0,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 19,
    fontFamily: Fonts.Montserrat,
    textAlign: 'center',
  },
  rewardContainer: {
    borderWidth: 2,
    borderColor: Colors.yellowLight,
    borderRadius: 15,
    padding: 15,
    marginVertical: 5,
    backgroundColor: Colors.white,
  },
  textContainer: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontFamily: Fonts.Montserrat,
    marginBottom: 8,
  },
  reward: {
    marginTop: 4,
    fontSize: 16,
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
  backButton2: {
    marginRight: 10,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
});