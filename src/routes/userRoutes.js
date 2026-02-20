const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

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

module.exports = router;