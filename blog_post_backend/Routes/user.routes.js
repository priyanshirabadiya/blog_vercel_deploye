const express = require('express');
const userRoutes = express.Router();
const { upload } = require('../helpers/imageUpload');
const {
    getAll,
    registerUser,
    loginUser,
    homeRoute,
    addBio,
    getProfile,
    updateProfile,
    uploadImage,
} = require('../controller/user.controller');
const { verifyToken } = require('../helpers/verifyToken');

userRoutes.get('/alluser', getAll);

userRoutes.post('/adduser', registerUser);

userRoutes.post('/loginuser', loginUser);

userRoutes.get('/home', verifyToken, homeRoute);

userRoutes.post('/addbio', verifyToken, addBio);

userRoutes.get('/profile/:userId', verifyToken, getProfile);

userRoutes.put('/uploadProfileImage/:userId', verifyToken, upload.single('image'), uploadImage);

userRoutes.put('/profile/update/:userId', verifyToken, updateProfile);

module.exports = userRoutes;
