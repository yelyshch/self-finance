require('dotenv').config();
const axios = require('axios');

const GOAL_SERVICE_URL = process.env.GOAL_SERVICE_URL;

const makeRequest = async (method, endpoint, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${GOAL_SERVICE_URL}${endpoint}`,
      headers: token ? { Authorization: token } : {},
    };

    if (method === "GET" && data?.params) {
      config.params = data.params;
    } else {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Goal service error');
  }
};

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
exports.createGoal = (req, res) => handleRequest(req, res, 'POST', '/new', true);
exports.getGoals = (req, res) => handleRequest(req, res, 'GET', '/get', true);
exports.updateGoal = (req, res) => handleRequest(req, res, 'PUT', `/${req.params.id}`, true);
exports.deleteGoal = (req, res) => handleRequest(req, res, 'DELETE', `/${req.params.id}`, true);
