const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", controller.logout);

// --- ROTAS PROTEGIDAS ---
router.get("/me", authMiddleware, controller.getMe);

module.exports = router;
