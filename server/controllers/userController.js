const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const ROLE = require("../constants/role");

const login = asyncHandler(async (req,res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("all fields are mandatory");
    }

    const user = await User.findOne({email});
    if (!user || !(await bcrypt.compare)(password,user.password)) {
        res.status(400);
        throw new Error("wrong password or username");
    }

    const accessToken = jwt.sign({
        user: {
            _id: user._id,
            username : user.username,
            password : user.password,
            email : user.email,
        }
    },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : "3h"
    });


    res.status(200).json({
        message : "User has been in!",
        token: accessToken
    })
})

const signup = asyncHandler(async (req,res) => {
    const { username, email, password } = req.body;
    const role = ROLE.user;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("all fields are mandatory");
    }
    if (!User.findOne({ email })) {
        res.status(400);
        throw new Error("user was already registered");
    }

    const userHashedPws = await bcrypt.hash(password, 10);
    const user =await User.create({
        username,
        email,
        password: userHashedPws,
        role: role,
    });

    if (user)
        res.status(200).json({
        message: "User has registered",
        _id: user._id,
        hashedPassword: await user.password,
        });
})

const currentUser = asyncHandler(async (req,res) => {
    if(!req.user) {
        res.status(400).json({
            message: "you haven't signed in",
            ok: 0
        })
    }

    res.status(200).json({
        user: req.user.username,
        user_id: req.user._id,
    });
})

module.exports = {
    login,
    signup,
    currentUser
}