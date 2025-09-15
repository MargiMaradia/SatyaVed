const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Registration controller
const register = async (req, res) => {
    try {
        console.log(req.body);  // Should output fullName, email, password

        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });

        }
        let role = "user";
        if (email === "admin@gmail.com") {
            role = "admin";
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }
        const user = new User({ fullName, email, password, role });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(400).json({ message: err.message });
    }
};


// Login controller
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                fullName: user.fullName,   // ✅ return fullName now
                email: user.email,
                role: user.role,
                token: generateToken(user)
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        console.error("Actual error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    register,
    loginUser
};
