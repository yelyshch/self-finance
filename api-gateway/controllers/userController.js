const axios = require('axios');
const jwt = require('jsonwebtoken');

// URL для доступу до User Service
const USER_SERVICE_URL = 'http://localhost:5001/api/users';

// Реєстрація користувача
exports.registerUser = async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/register`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Логін користувача
exports.loginUser = async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/login`, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Отримання поточного користувача
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await axios.get(`${USER_SERVICE_URL}/me`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.status(200).json(user.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching current user' });
  }
};

// Оновлення користувача
exports.updateUser = async (req, res) => {
  try {
    const user = await axios.put(`${USER_SERVICE_URL}/update`, req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.status(200).json(user.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Видалення користувача
exports.deleteUser = async (req, res) => {
  try {
    const response = await axios.delete(`${USER_SERVICE_URL}/delete`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Отримання всіх користувачів
exports.getAllUsers = async (req, res) => {
  try {
    const users = await axios.get(`${USER_SERVICE_URL}/`);
    res.status(200).json(users.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};
