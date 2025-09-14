const Submission = require("../models/Submission");

const createSubmission = async (req, res) => {
    try {
        const submission = new Submission(req.body);
        const created = await submission.save();
        res.status(201).json(created);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find();
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const reviewSubmission = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission) return res.status(404).json({ message: 'Not found' });
        submission.status = req.body.status;
        const updated = await submission.save();
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    createSubmission,
    getSubmissions,
    reviewSubmission,
};
