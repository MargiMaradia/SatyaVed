const express = require("express");
const router = express.Router();
const mythController = require("../controllers/mythController");
const { protect } = require("../middleware/auth"); // Use destructuring!

router.get("/", mythController.listMyths);
router.get("/:id", mythController.getMyth);

router.post("/", protect, mythController.createMyth);

router.post("/approve/:id", protect, mythController.approveMyth);
router.post("/reject/:id", protect, mythController.rejectMyth);
router.delete("/:id", protect, mythController.deleteMyth);


router.put("/:id", protect, mythController.updateMyth);
module.exports = router;
