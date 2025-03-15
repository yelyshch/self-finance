require('dotenv').config();
const axios = require('axios');

// URL для доступу до User Service
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

// Функція для виконання запитів
const makeRequest = async (method, url, data = null, token = null) => {
  try {
    const config = token ? { headers: { Authorization: token } } : {};
    const response = await axios({ method, url, data, ...config });
    return response.data;
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    throw new Error('Error performing request');
  }
};

// Реєстрація користувача
exports.registerUser = async (req, res) => {
  try {
    const user = await makeRequest('POST', `${USER_SERVICE_URL}/register`, req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Логін користувача
exports.loginUser = async (req, res) => {
  try {
    const user = await makeRequest('POST', `${USER_SERVICE_URL}/login`, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Отримання поточного користувача
exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res.status(400).json({ message: 'Authorization header is missing' });
    }
    const user = await makeRequest('GET', `${USER_SERVICE_URL}/me`, null, req.headers.authorization);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching current user' });
  }
};

// Оновлення користувача
exports.updateUser = async (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res.status(400).json({ message: 'Authorization header is missing' });
    }
    const user = await makeRequest('PUT', `${USER_SERVICE_URL}/update`, req.body, req.headers.authorization);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Видалення користувача
exports.deleteUser = async (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res.status(400).json({ message: 'Authorization header is missing' });
    }
    const user = await makeRequest('DELETE', `${USER_SERVICE_URL}/delete`, null, req.headers.authorization);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Отримання всіх користувачів
exports.getAllUsers = async (req, res) => {
  try {
    const users = await makeRequest('GET', `${USER_SERVICE_URL}/`);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};
