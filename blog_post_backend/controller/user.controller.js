const User = require('../model/user.model');
const Messages = require('../helpers/messages');
const jwt = require('jsonwebtoken');
const bcypt = require('bcrypt');
const fs = require('fs');
const messages = require('../helpers/messages');

exports.getAll = async (req, res) => {
    try {
        const allusers = await User.find({ isDelete: false });
        res.send(allusers);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: Messages.INTERNAL_SERVER_ERROR })
    }
}


exports.registerUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email, isDelete: false });
        if (existingUser) {
            return res.status(500).send({ message: "User already exists with this email." });
        }

        // Generate a unique username
        let userName = req.body.userName || generateUniqueUserName(req.body.firstName, req.body.lastName);

        let existuserName = await User.findOne({ userName: req.body.userName, isDelete: false });
        if (existuserName) {
            return res.send("username should be unique");
        }

        userName = generateUniqueUserName(req.body.firstName, req.body.lastName);

        let hashpassword = await bcypt.hash(req.body.password, 10);
        let newuser = await User.create({
            ...req.body,
            password: hashpassword,
            userName
        });
        // console.log("New User is", newuser);

        let accessToken = jwt.sign({ userID: newuser._id }, process.env.JWT_SECREATE);
        res.send({
            message: "User successfully registered",
            userName: newuser.userName,
            firstName: newuser.firstName,
            lastName: newuser.lastName,
            _id: newuser._id,
            email: newuser.email,
            bio: newuser.bio,
            image: newuser.image || null,
            accessToken: accessToken
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

// Helper function to generate a unique username
const generateUniqueUserName = (firstName, lastName) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
    return `${firstName}_${lastName}_${randomSuffix}`;
}


exports.loginUser = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email, isDelete: false });
        // console.log("login user is:", user);
        if (!user) {
            // return res.send({ message: Messages.USER_NOT_FOUND });
            return res.status(404).send({ message: "Incorrect email ID or password" });
        }
        let comparepassword = await bcypt.compare(req.body.password, user.password);
        if (!comparepassword) {
            return res.status(404).send({ message: "Incorrect email ID or password" })
        }
        let token = await jwt.sign({ userID: user._id }, process.env.JWT_SECREATE)
        return res.status(200).send({
            message: Messages.LOGIN_SUCCESS,
            accessToken: token,
            _id: user._id,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            bio: user.bio,
            image: user.image,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: Messages.INTERNAL_SERVER_ERROR });
    }
}



exports.homeRoute = async (req, res) => {
    try {
        res.send("this is home.");
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: Messages.INTERNAL_SERVER_ERROR });
    }
}

exports.addBio = async (req, res) => {
    try {
        const { bio, userId } = req.body;
        const user = await User.findById(userId, { isDelete: false });
        if (!user) {
            return res.send({ message: Messages.USER_NOT_FOUND })
        }
        user.bio = bio;
        await user.save();
        res.send("bio addded successfully..");
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: Messages.INTERNAL_SERVER_ERROR });
    }
}

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (user) {
            res.json({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                bio: user.bio,
                userName: user.userName,
                image: user.image,
            });
        } else {
            res.status(404).json({ error: Messages.USER_NOT_FOUND });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: Messages.INTERNAL_SERVER_ERROR });
    }
}

exports.updateProfile = async (req, res) => {
    try {

        let user = await User.findById(req.params.userId);
        if (!user) {
            res.send({ message: Messages.USER_NOT_FOUND });
        }

        // add pipeline that is ne:not equal to user id
        let { userName } = req.body;
        let existusername = await User.findOne({
            userName: userName,
            _id: { $ne: user._id }
        });
        if (existusername) {
            // return res.status(404).send(console.log("Already exist.."));
            return res.status(400).send({ message: 'Username is not available try to use another username.' });
        }

        user = await User.findByIdAndUpdate(user._id, { $set: req.body }, { new: true });
        res.send({ user, messages: Messages.UPDATED_SUCCESS });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: Messages.INTERNAL_SERVER_ERROR });
    }
}

exports.uploadImage = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: Messages.USER_NOT_FOUND });
        }
        // Convert buffer to base64 and store it
        const base64Image = req.file.buffer.toString('base64');
        // console.log(base64Image);
        user.image = base64Image;
        await user.save();

        res.status(200).json({ message: "Profile image updated successfully.", image: base64Image });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Messages.INTERNAL_SERVER_ERROR });
    }
};

