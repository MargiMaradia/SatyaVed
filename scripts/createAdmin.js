require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const connectDB = require("../config/db");

const createAdmin = async () => {
    try {
        await connectDB();
        const username = process.env.ADMIN_USERNAME || "admin";
        const password = process.env.ADMIN_PASSWORD || "admin123";
        const existing = await User.findOne({ username });
        if (existing) {
            console.log("Admin already exists:", username);
            process.exit(0);
        }
        const user = new User({ username, password, role: "admin" });
        await user.save();
        console.log("Admin user created:", username);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();
