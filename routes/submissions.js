const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const { protect } = require("../middleware/auth");

// Debug function types
console.log("typeof createSubmission:", typeof submissionController.createSubmission);

router.post("/", submissionController.createSubmission);
router.get("/", protect, submissionController.getSubmissions);
router.put("/:id/review", protect, submissionController.reviewSubmission);

module.exports = router;
