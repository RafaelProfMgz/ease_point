const AuthModel = require("../models/authModel");

exports.getGoogleUrl = async (req, res) => {
  try {
    const data = await AuthModel.getOAuthUrl("google");
    res.json({ url: data.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGithubUrl = async (req, res) => {
  try {
    const data = await AuthModel.getOAuthUrl("github");
    res.json({ url: data.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFacebookUrl = async (req, res) => {
  try {
    const data = await AuthModel.getOAuthUrl("facebook");
    res.json({ url: data.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.githubCallback = async (req, res) => {
  try {
    res.json({ message: "Github callback recebido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    res.json({ message: "Google callback recebido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.facebookCallback = async (req, res) => {
  try {
    res.json({ message: "Facebook callback recebido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
