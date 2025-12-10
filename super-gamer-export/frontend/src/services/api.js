import axios from 'axios';
import mockBackend from './mockBackend';

// Detectar si estamos en modo desarrollo o producción
const IS_GITHUB_PAGES = !process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL.includes('github.io');
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// API Service que usa backend real o mock según el entorno
class ApiService {
  constructor() {
    this.useMock = IS_GITHUB_PAGES;
  }

  // Auth
  async register(email, password, name) {
    if (this.useMock) {
      return await mockBackend.register(email, password, name);
    }
    const response = await axios.post(`${API}/auth/register`, { email, password, name });
    return response.data;
  }

  async login(email, password) {
    if (this.useMock) {
      return await mockBackend.login(email, password);
    }
    const response = await axios.post(`${API}/auth/login`, { email, password });
    return response.data;
  }

  async getMe(token) {
    if (this.useMock) {
      return await mockBackend.getMe(token);
    }
    const response = await axios.get(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  // Items
  async getItems(category) {
    if (this.useMock) {
      return await mockBackend.getItems(category);
    }
    const response = await axios.get(`${API}/items`, { params: { category } });
    return response.data;
  }

  async createItem(itemData, token) {
    if (this.useMock) {
      return await mockBackend.createItem(itemData, token);
    }
    const response = await axios.post(`${API}/items`, itemData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async updateItem(itemId, updateData, token) {
    if (this.useMock) {
      return await mockBackend.updateItem(itemId, updateData, token);
    }
    const response = await axios.put(`${API}/items/${itemId}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  async deleteItem(itemId, token) {
    if (this.useMock) {
      return await mockBackend.deleteItem(itemId, token);
    }
    const response = await axios.delete(`${API}/items/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  // Comments
  async getComments(itemId, category) {
    if (this.useMock) {
      return await mockBackend.getComments(itemId, category);
    }
    const response = await axios.get(`${API}/comments`, {
      params: { item_id: itemId, category }
    });
    return response.data;
  }

  async createComment(commentData, token) {
    if (this.useMock) {
      return await mockBackend.createComment(commentData, token);
    }
    const response = await axios.post(`${API}/comments`, commentData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
}

export default new ApiService();