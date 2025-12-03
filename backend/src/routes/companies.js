const express = require("express");
const router = express.Router();
const controller = require("../controllers/companyController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", controller.createCompany);
router.get("/:id", controller.findCompanyById);

// --- ROTAS PROTEGIDAS ---
router.put("/:id", authMiddleware, controller.updateCompany);
router.delete("/:id", authMiddleware, controller.deleteCompany);

module.exports = router;
