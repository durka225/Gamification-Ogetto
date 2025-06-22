import axios from 'axios';

// Получить список категорий с backend
export const fetchCategories = async () => {
  try {
    const response = await axios.get('http://150.241.101.78:8443/api/rewards/category');
    // Возвращаем массив строк (названия категорий)
    return response.data.map((cat) => cat.category);
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
    return [];
  }
};