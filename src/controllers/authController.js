const authService = require("../services/authService");


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