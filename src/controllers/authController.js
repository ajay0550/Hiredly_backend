const authService = require("../services/authService");
const User = require("../models/User");

exports.register = async (req,res)=>{
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({ message: "User registered", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);
    console.log("REQ.BODY:", req.body);

    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, runValidators: true }
    ).select("-password");

    console.log("UPDATED USER:", user);

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(400).json({
      success: false,
      message: "Profile update failed",
    });
  }
};