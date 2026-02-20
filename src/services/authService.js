const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser =  async (data) => {
    const {name,email,password,role} = data;

    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new Error("User already Exists");
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await User.create ({
        name,
        email,
        password: hashedPassword,
        role
    });

    return user;
};

exports.loginUser = async (data) => {
    const { email, password } = data;

    console.log("Email received:", email);
    console.log("Password received:", password);

    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
        throw new Error("Invalid credentials - user not found");
    }

    console.log("Stored hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
        throw new Error("Invalid credentials - password mismatch");
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return { user, token };
};