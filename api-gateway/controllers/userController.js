require('dotenv').config();
const axios = require('axios');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

// Функція для виконання запитів
const makeRequest = async (method, endpoint, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${USER_SERVICE_URL}${endpoint}`,
      data,
      headers: token ? { Authorization: token } : {},
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Error performing request');
  }
};

// Функція-обгортка для виклику makeRequest із перевіркою токена
const handleRequest = async (req, res, method, endpoint, requireAuth = false) => {
  try {
    const token = requireAuth ? req.headers.authorization : null;
    if (requireAuth && !token) {
      return res.status(400).json({ message: 'Authorization header is missing' });
    }

    const data = await makeRequest(method, endpoint, req.body, token);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Експортуємо контролери
exports.registerUser = (req, res) => handleRequest(req, res, 'POST', '/register');
exports.loginUser = (req, res) => handleRequest(req, res, 'POST', '/login');
exports.getCurrentUser = (req, res) => handleRequest(req, res, 'GET', '/me', true);
exports.updateUser = (req, res) => handleRequest(req, res, 'PUT', '/update', true);
exports.deleteUser = (req, res) => handleRequest(req, res, 'DELETE', '/delete', true);
exports.getAllUsers = (req, res) => handleRequest(req, res, 'GET', '/');
