const express = require("express");
const router = express.Router();
const controller = require("../controllers/providerController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/provider/google", controller.getGoogleUrl);
router.get("/provider/github", controller.getGithubUrl);
router.get("/provider/facebook", controller.getFacebookUrl);

// --- ROTAS PROTEGIDAS ---
router.get(
  "/provider/github/callback",
  authMiddleware,
  controller.githubCallback
);
router.get(
  "/provider/google/callback",
  authMiddleware,
  controller.googleCallback
);
router.get(
  "/provider/facebook/callback",
  authMiddleware,
  controller.facebookCallback
);

module.exports = router;
