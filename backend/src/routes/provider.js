const express = require("express");
const router = express.Router();
const controller = require("../controllers/providerController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/google", controller.getGoogleUrl);

router.post(
  "/google-complete",
  authMiddleware,
  controller.completeGoogleSignup
);

router.get("/provider-data", authMiddleware, controller.getProviderData);

module.exports = router;
