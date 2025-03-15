const userService = require('../services/userService');

const register = async (req, res) => {
  try {
    const token = await userService.registerUser(req.body.name, req.body.email, req.body.password);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const token = await userService.loginUser(req.body.email, req.body.password);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.user.id, req.body.name, req.body.email);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.user.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login, getCurrentUser, updateUser, deleteUser, getAllUsers };
