const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const mythRoutes = require("./routes/myths");
const submissionRoutes = require("./routes/submissions");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/myths", mythRoutes);
app.use("/api/submissions", submissionRoutes);

app.get("/", (req, res) => {
    res.json({ message: "API is running." });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Server error" });
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
