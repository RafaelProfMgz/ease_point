const express = require("express");
const router = express.Router();
const controller = require("../controllers/pointsController");
const authMiddleware = require("../middlewares/authMiddleware");

// --- ROTAS PROTEGIDAS ---
router.post("/", authMiddleware, controller.registerPoint);
router.get("/", authMiddleware, controller.listPointsByUser);
router.get("/company/:id", authMiddleware, controller.listPointsByCompany);
router.get("/:id", authMiddleware, controller.findPointById);
router.put("/:id", authMiddleware, controller.updatePoint);
router.delete("/:id", authMiddleware, controller.deletePoint);

module.exports = router;
