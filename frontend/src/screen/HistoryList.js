import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryList = () => {
  const [bonuses, setBonuses] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return;
        const response = await axios.get('http://***/api/user/transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBonuses(response.data || []);
      } catch (error) {
        console.error('Ошибка при получении истории начислений:', error);
      }
    };
    fetchTransactions();
  }, []);

  const getTypeText = (type) => {
    switch (type?.toUpperCase()) {
      case 'DEBIT': return 'Начисление';
      case 'CREDIT': return 'Списание';
      default: return 'Операция';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Транзакции</Text>
      <FlatList
        data={bonuses}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={[
              styles.points,
              { color: Number(item.point) < 0 ? '#FF4444' : '#4CAF50' }
            ]}>
              {item.point || '0'} Баллов
            </Text>
            <Text style={styles.type}>
              Тип: {getTypeText(item.type)}
            </Text>
            <Text style={styles.date}>
              Дата: {new Date(item.date).toLocaleDateString()}
            </Text>
            <Text style={styles.reason}>
              Описание: {item.description || '—'}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default HistoryList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  card: {
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    marginTop: 5,
  },
  reason: {
    fontSize: 14,
    marginTop: 5,
  },
  type: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: '500',
  },
});
