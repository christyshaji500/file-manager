const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    createUser,
    findUserByEmail
} = require("../models/user.model");

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUser(
            username,
            email,
            hashedPassword
        );

        res.status(201).json({
            success: true,
            user
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // res.status(200).json({
        //     success: true,
        //     token,
        //     user: {
        //         id: user.id,
        //         username: user.username,
        //         email: user.email
        //     }
        // });
        res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true later on HTTPS
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
});

res.status(200).json({
    success: true,
    user: {
        id: user.id,
        username: user.username,
        email: user.email
    }
});

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

const profile = async (req, res) => {

    res.status(200).json({
        success: true,
        user: req.user
    });

};

const logout = async (req, res) => {

    res.clearCookie("token");

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });

};

module.exports = {
    register,
    login,
    profile,
    logout
};