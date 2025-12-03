const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);

// --- ROTAS PROTEGIDAS ---
router.get("/company/:id", authMiddleware, controller.listUsersByCompany);
router.get("/:id", authMiddleware, controller.findUserById);
router.put("/:id", authMiddleware, controller.updateUser);
router.delete("/:id", authMiddleware, controller.deleteUser);


module.exports = router;
