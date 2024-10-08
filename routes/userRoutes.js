const express = require('express');
// eslint-disable-next-line import/no-useless-path-segments
const userController = require('./../controllers/userController');

const router = express.Router();

router
	.route('/')
	.get(userController.getAllUsers)
	.post(userController.createUser);

router
	.route('/:id')
	.get(userController.getUser)
	.patch(userController.upodateUser)
	.delete(userController.deleteUser);

module.exports = router;
