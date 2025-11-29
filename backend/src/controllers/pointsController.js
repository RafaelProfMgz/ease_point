const PointsModel = require("../models/PointModel");
const UserModel = require("../models/userModel");

exports.registerPoint = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, description } = req.body;

    const userProfile = await UserModel.findById(userId);

    if (!userProfile) {
      return res
        .status(404)
        .json({ error: "Perfil de usuário não encontrado." });
    }

    const newPoint = await PointsModel.create({
      user_id: userId,
      company_id: userProfile.company_id,
      type,
      description,
    });

    res.status(201).json(newPoint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listMyPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    const points = await PointsModel.findByUserId(userId);
    res.json(points);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findPointById = async (req, res) => {
  try {
    const { id } = req.params;
    const point = await PointsModel.findById(id);

    if (!point)
      return res.status(404).json({ error: "Registro não encontrado" });

    res.json(point);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listPointsByCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const points = await PointsModel.findByCompanyId(id);
    res.json(points);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePoint = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, description } = req.body;

    const updatedPoint = await PointsModel.update(id, { type, description });
    res.json(updatedPoint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePoint = async (req, res) => {
  try {
    const { id } = req.params;
    await PointsModel.delete(id);
    res.json({ message: "Registro excluído com sucesso." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
