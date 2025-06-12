import categoriesData from '../mockData/categories.json';
import { delay } from '../index';

let categories = [...categoriesData];

export const categoryService = {
  async getAll() {
    await delay(250);
    return [...categories].sort((a, b) => a.order - b.order);
  },

  async getById(id) {
    await delay(200);
    const category = categories.find(c => c.id === id);
    if (!category) throw new Error('Category not found');
    return { ...category };
  },

  async create(categoryData) {
    await delay(300);
    const newCategory = {
      id: Date.now().toString(),
      ...categoryData,
      order: categoryData.order ?? categories.length
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, updates) {
    await delay(250);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    categories[index] = { ...categories[index], ...updates };
    return { ...categories[index] };
  },

  async delete(id) {
    await delay(200);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    categories.splice(index, 1);
    return true;
  }
};