const ProviderModel = require("../models/providerModel");
const UserModel = require("../models/userModel");
const CompanyModel = require("../models/companyModel");

exports.getGoogleUrl = async (req, res) => {
  try {
    const data = await ProviderModel.getOAuthUrl("google");
    res.json({ url: data.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.completeGoogleSignup = async (req, res) => {
  const authId = req.user.id;
  const email = req.user.email;
  const { companyName, plan, name } = req.body;

  let newCompanyId = null;

  try {
    const existingUser = await UserModel.findById(authId);

    if (existingUser) {
      return res.status(400).json({ error: "Usuário já cadastrado." });
    }

    const company = await CompanyModel.create({ name: companyName, plan });
    newCompanyId = company.id;

    await UserModel.create({
      id: authId,
      name: name,
      email: email,
      company_id: company.id,
      role: "admin",
      avatar_url: req.user.user_metadata?.avatar_url || null,
    });

    res.status(201).json({
      message: "Cadastro finalizado com sucesso!",
      company,
      user: { id: authId, email },
    });
  } catch (error) {
    console.error("Erro ao finalizar cadastro Google:", error);
    if (newCompanyId) {
      await CompanyModel.delete(newCompanyId);
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getProviderData = (req, res) => {
  try {
    const user = req.user;
    const meta = user.user_metadata || {};

    res.json({
      email: user.email,
      name: meta.full_name || meta.name || "",
      avatar_url: meta.avatar_url || meta.picture || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
