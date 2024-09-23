const express = require('express');
const router = express.Router();

//ROUTER HANDLERS
const getAllUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route is not yet defined"
    });
}

const getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route ius not yet defined"
    });
}

const createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route ius not yet defined"
    });
}

const upodateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route is not yet defined"
    });
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route is not yet defined"
    });
}

//ROUTER
router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .patch(upodateUser)
    .delete(deleteUser);

module.exports = router;