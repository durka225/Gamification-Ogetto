import images from "./Photos";
import descriptions from "./Description"
import costs from "./Costs"
import categories from "./Categories";
import descriptionCategory from "./DescriptionCategory";
import axios from "axios";
{/*categories.category1,
categories.category2,
categories.category3,
categories.category4,
categories.category5,
categories.category6,
categories.category7,
categories.category8,*/}
{/*categories.category1,
    descriptionCategory.descriptionCategory1,
    descriptionCategory.descriptionCategory2,
    descriptionCategory.descriptionCategory3,
    descriptionCategory.descriptionCategory4,
    descriptionCategory.descriptionCategory5,
    descriptionCategory.descriptionCategory6,
    descriptionCategory.descriptionCategory7,
    descriptionCategory.descriptionCategory8,*/}
export let category = [

]
export let descriptionCategories = [

]
export let photos = [
    images.photo1,
    images.photo2,
    images.photo3,
    images.photo4,
    images.photo5,
    images.photo6,
    images.photo7,
    images.photo8,
    images.photo9,
    images.photo10,
    images.photo11,
    images.photo12,
    images.photo13,
    images.photo14,
    images.photo15,
    images.photo16,
    images.photo17,
    images.photo18,
    images.photo19,
    images.photo20,
]

export let description = [
    descriptions.description1,
    descriptions.description2,
    descriptions.description3,
]

export let cost = [
    costs.cost1,
    costs.cost2,
    costs.cost3,
    costs.cost4,
    costs.cost5,
    costs.cost6,
    costs.cost7,
    costs.cost8,
    costs.cost9,
    costs.cost10,
    costs.cost11,
    costs.cost12,
    costs.cost13,
    costs.cost14,
    costs.cost15,
    costs.cost16,
    costs.cost17,
    costs.cost18,
    costs.cost19,
    costs.cost20,
]

// Получить список категорий активностей с backend
export const fetchActivityCategories = async () => {
  try {
    const response = await axios.get('/api/activity/category');
    // Возвращаем массив строк (названия категорий)
    return response.data.map((cat) => cat.category);
  } catch (error) {
    console.error('Ошибка при загрузке категорий активностей:', error);
    return [];
  }
};

// Добавить новую категорию активности на backend
export const addActivityCategory = async (categoryName) => {
  try {
    const response = await axios.post(
      '/api/activity/newCategory',
      categoryName,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data; // объект с id и category
  } catch (error) {
    console.error('Ошибка при добавлении категории активности:', error);
    return null;
  }
};

// Получить список оконченных активностей с backend
export const fetchEndedActivities = async () => {
  try {
    const response = await axios.get('/api/activity/end');
    return response.data; // массив объектов с id, title, category
  } catch (error) {
    console.error('Ошибка при загрузке оконченных активностей:', error);
    return [];
  }
};

// Получить список всех текущих и будущих активностей с backend
export const fetchActiveActivities = async () => {
  try {
    const response = await axios.get('/api/activity');
    return response.data; // массив объектов с id, title, reward, category, users
  } catch (error) {
    console.error('Ошибка при загрузке активных активностей:', error);
    return [];
  }
};

// Обновить данные активности по id
export const updateActivity = async (id, activityData) => {
  try {
    const response = await axios.put(
      `/api/activity/change/${id}`,
      activityData,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data; // true при успехе, иначе false
  } catch (error) {
    console.error('Ошибка при обновлении активности:', error);
    return false;
  }
};