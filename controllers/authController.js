const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Registration controller
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // If email is admin@gmail.com, assign admin; otherwise, user
        let role = "user";
        if (email === "admin@gmail.com") {
            role = "admin";
        }

        const user = new User({ username, email, password, role });
        await user.save();

        res.status(201).json({ message: "User registered", user });
    } catch (err) {
        console.error("Actual error:", err);
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
                username: user.username,
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

// Export both functions ONLY with module.exports at the end
module.exports = {
    register,
    loginUser
};
