const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const { getProfileStats, changePassword, uploadResume } = require("../controllers/userController");
const upload = require("../middlewares/uploadMiddleware");


router.get("/profile", protect, (req, res) => {
    res.json(req.user);
});

// Admin-only test route
router.get(
    "/admin-test",
    protect,
    authorizeRoles("admin"),
    (req, res) => {
        res.json({ message: "Welcome Admin" });
    }
);

router.post(
  "/upload-resume",
  protect,
  upload.single("resume"),
  uploadResume
);

router.get("/profile-stats", protect, getProfileStats);

router.put("/change-password", protect, changePassword);

module.exports = router;