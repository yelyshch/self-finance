const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (name, email, password) => {
  let user = await User.findOne({ email });
  if (user) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  user = new User({ name, email, password: hashedPassword });
  await user.save();

  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const getUserById = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

const updateUser = async (id, name, email) => {
  return await User.findByIdAndUpdate(id, { name, email }, { new: true });
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

const getAllUsers = async () => {
  return await User.find().select('-password');
};

module.exports = { registerUser, loginUser, getUserById, updateUser, deleteUser, getAllUsers };
