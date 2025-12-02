const PointModel = require("../models/pointModel");
const UserModel = require("../models/userModel");

exports.registerPoint = async (req, res) => {
  try {
    const userId = req.user.id;

    const userFullData = await UserModel.findById(userId);
    if (!userFullData || !userFullData.company_id) {
      return res.status(400).json({ error: "Usuário sem empresa." });
    }

    let { type, description, latitude, longitude } = req.body;
    if (type) type = type.toLowerCase();

    const newPoint = await PointModel.create({
      user_id: userId,
      company_id: userFullData.company_id,
      type,
      description,
      latitude,
      longitude,
    });

    res.status(201).json(newPoint);
  } catch (err) {
    console.error("Erro register:", err);
    return res.status(400).json({ error: err.message });
  }
};

exports.listPointsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const points = await PointModel.findByUserId(userId);
    res.json(points);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listPointsByCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const points = await PointModel.findByCompanyId(id);
    res.json(points);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findPointById = async (req, res) => {
  try {
    const { id } = req.params;
    const point = await PointModel.findById(id);
    if (!point) return res.status(404).json({ error: "Não encontrado" });
    res.json(point);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updatePoint = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, description, created_at } = req.body;

    let typeFixed = type;
    if (typeFixed) typeFixed = typeFixed.toLowerCase();

    const updatedPoint = await PointModel.update(id, {
      type: typeFixed,
      description,
      ...(created_at && { created_at }),
    });
    res.json(updatedPoint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePoint = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await PointModel.delete(id, userId);
    res.json({ message: "Excluído." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
