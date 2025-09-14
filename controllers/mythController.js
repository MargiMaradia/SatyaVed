const Myth = require("../models/Myth");

const listMyths = async (req, res) => {
    console.log("GET /api/myths called");
    try {
        const { q, category, tag, status, limit = 20, page = 1 } = req.query;
        const filter = {};
        if (q) filter.$or = [
            { title: { $regex: q, $options: "i" } },
            { content: { $regex: q, $options: "i" } },
            { tags: { $regex: q, $options: "i" } }
        ];
        if (category) filter.category = category;
        if (tag) filter.tags = tag;
        if (status) filter.status = status;
        const skip = (Math.max(Number(page), 1) - 1) * Number(limit);
        const myths = await Myth.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
        res.json({ count: myths.length, data: myths });
    } catch (err) {
        console.error("Controller error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const getMyth = async (req, res) => {
    try {
        const myth = await Myth.findById(req.params.id);
        if (!myth) return res.status(404).json({ message: "Myth not found" });
        res.json(myth);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const createMyth = async (req, res) => {
    try {
        const payload = req.body;
        payload.createdBy = req.user.id;
        const newMyth = new Myth(payload);
        await newMyth.save();
        res.status(201).json(newMyth);
    } catch (err) {
        res.status(400).json({ message: err.message || "Invalid data" });
    }
};

const approveMyth = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    try {
        const myth = await Myth.findById(req.params.id);
        if (!myth) return res.status(404).json({ message: "Myth not found" });
        myth.status = "approved";
        myth.approvedBy = req.user.id;
        await myth.save();
        res.json({ message: "Myth approved", myth });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


const rejectMyth = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    try {
        const myth = await Myth.findById(req.params.id);
        if (!myth) return res.status(404).json({ message: "Myth not found" });
        myth.status = "rejected";
        myth.approvedBy = req.user.id;
        await myth.save();
        res.json({ message: "Myth rejected", myth });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const updateMyth = async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    try {
        const updatedMyth = await Myth.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedMyth) {
            return res.status(404).json({ message: "Myth not found" });
        }
        res.json(updatedMyth);
    } catch (err) {
        console.error("Update error:", err);
        res.status(400).json({ message: err.message || "Invalid data" });
    }
};


// const deleteMyth = async (req, res) => {
//     if (req.user.role !== "admin") {
//         return res.status(403).json({ message: "Admin access only" });
//     }
//     try {
//         const myth = await Myth.findByIdAndDelete(req.params.id);
//         if (!myth) return res.status(404).json({ message: "Myth not found" });
//         res.json({ message: "Myth deleted" });
//     } catch (err) {
//         res.status(500).json({ message: "Server error" });
//     }
// };



const deleteMyth = async (req, res) => {
    // Debug: Log current authenticated user
    console.log("Authenticated user object:", req.user);

    // Admin-only check
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    try {
        const myth = await Myth.findByIdAndDelete(req.params.id);
        if (!myth) {
            return res.status(404).json({ message: "Myth not found" });
        }
        res.json({ message: "Myth deleted" });
    } catch (err) {
        console.error("Error deleting myth:", err);
        res.status(500).json({ message: "Server error" });
    }
};



module.exports = {
    listMyths,
    getMyth,
    createMyth,
    approveMyth,
    rejectMyth,
    deleteMyth,
    updateMyth
};
