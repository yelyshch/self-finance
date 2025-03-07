const express = require('express');
const { register, login, getCurrentUser, updateUser, deleteUser, getAllUsers  } = require('../controllers/UserController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);
router.put('/update', authenticate, updateUser);
router.delete('/delete', authenticate, deleteUser);
router.get('/', getAllUsers);

module.exports = router;
