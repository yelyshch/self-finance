require('dotenv').config();
const axios = require('axios');

const TRANSACTION_SERVICE_URL = process.env.TRANSACTION_SERVICE_URL;

// Функція для виконання запитів
const makeRequest = async (method, endpoint, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${TRANSACTION_SERVICE_URL}${endpoint}`,
      headers: token ? { Authorization: token } : {},
    };

    if (method === "GET" && data?.params) {
      config.params = data.params; // Додаємо параметри до GET-запиту
    } else {
      config.data = data;
    }

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

    const params = req.query;
    const data = method === "GET" ? { params } : req.body;

    const response = await makeRequest(method, endpoint, data, token);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Контролери
exports.addTransaction = (req, res) => handleRequest(req, res, 'POST', '/new', true);
exports.getTransactions = (req, res) => handleRequest(req, res, 'GET', '/get', true);
exports.deleteTransaction = (req, res) => handleRequest(req, res, 'DELETE', `/${req.url}`, true);
