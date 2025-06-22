import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../assets/Colors';
import { Fonts } from '../../assets/fonts/Fonts';

const PointsAddScreen = () => {
  const navigation = useNavigation();
  const [pointRequests, setPointRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPointRequests = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get('http://***/api/points', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pendingRequests = response.data.filter(request => request.status !== 'APPROVED');
      setPointRequests(pendingRequests);
    } catch (error) {
      console.error('Ошибка при получении заявок:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить заявки');
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPointRequests();
    setRefreshing(false);
  }, [fetchPointRequests]);

  useFocusEffect(
    useCallback(() => {
      fetchPointRequests();
    }, [fetchPointRequests])
  );

  const handleConfirm = async (id) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axios.post(`http://***/api/points/success/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPointRequests(current => current.filter(request => request.id !== id));
      Alert.alert('Успех', 'Баллы успешно начислены');
    } catch (error) {
      console.error('Ошибка при подтверждении:', error);
      Alert.alert('Ошибка', 'Не удалось подтвердить начисление');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
          <Image source={require('../../assets/images/menuButton.png')} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Заявки на начисление</Text>
      </View>

      <FlatList
        data={pointRequests}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.yellowLight]}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <View style={styles.requestInfo}>
              <Text style={styles.userText}>
                Пользователь: {item.login ? `${item.login}` : 'Неизвестно'}
              </Text>
              <Text style={styles.pointsText}>Баллы: {item.points}</Text>
              <Text style={styles.descriptionText}>Описание: {item.description}</Text>
            </View>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => handleConfirm(item.id)}
            >
              <Text style={styles.confirmText}>ПОДТВЕРДИТЬ</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default PointsAddScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: Colors.white,
  },
  menuButton: {
    marginLeft: 10,
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontFamily: Fonts.MontserratBold,
    textAlign: 'center',
    flex: 1,
  },
  requestItem: {
    backgroundColor: Colors.white,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.yellowLight,
  },
  requestInfo: {
    marginBottom: 12,
  },
  userText: {
    fontSize: 16,
    fontFamily: Fonts.MontserratBold,
    marginBottom: 4,
  },
  pointsText: {
    fontSize: 14,
    fontFamily: Fonts.Montserrat,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: Fonts.Montserrat,
  },
  confirmButton: {
    backgroundColor: Colors.yellowLight,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
  },
});
