const UserModel = require("../models/userModel");
const CompanyModel = require("../models/companyModel");
const AuthModel = require("../models/authModel");

exports.createCompany = async (req, res) => {
  const { companyName, plan, adminName, email, password } = req.body;
  let newCompanyId = null;

  try {
    const validPlans = ["bronze", "prata", "ouro"];
    if (!plan || !validPlans.includes(plan)) {
      return res.status(400).json({ error: "Plano inválido." });
    }

    const company = await CompanyModel.create({ name: companyName, plan });
    newCompanyId = company.id;

    const { data: authData, error: authError } = await AuthModel.signUp({
      email,
      password,
    });

    if (
      authError ||
      !authData.user ||
      (authData.user.identities && authData.user.identities.length === 0)
    ) {
      throw new Error("Erro no Auth: Email já cadastrado ou erro no Supabase.");
    }

    await UserModel.create({
      id: authData.user.id,
      name: adminName,
      email: email,
      company_id: company.id,
      role: "admin",
    });

    res.status(201).json({
      message: "Empresa e Administrador criados com sucesso!",
      company: company,
      user: { id: authData.user.id, email },
    });
  } catch (error) {
    console.error("Erro no cadastro:", error.message);

    if (newCompanyId) {
      console.log("Desfazendo criação da empresa:", newCompanyId);
      await CompanyModel.delete(newCompanyId).catch(() =>
        console.log("Erro ao desfazer")
      );
    }

    res.status(400).json({ error: error.message });
  }
};

exports.completeGoogleRegistration = async (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;

  const { companyName, plan, adminName } = req.body;

  const validPlans = ["bronze", "prata", "ouro"];
  if (!plan || !validPlans.includes(plan)) {
    return res.status(400).json({ error: "Plano inválido." });
  }

  try {
    const existingUser = await UserModel.findById(userId).catch(() => null);
    if (existingUser && existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "Usuário já possui cadastro completo." });
    }

    const company = await CompanyModel.create({ name: companyName, plan });

    try {
      await UserModel.create({
        id: userId,
        name: adminName,
        email: userEmail,
        company_id: company.id,
        role: "admin",
      });
    } catch (profileError) {
      await CompanyModel.delete(company.id);
      return res
        .status(400)
        .json({ error: "Erro ao criar perfil: " + profileError.message });
    }

    res.status(201).json({
      message: "Cadastro via provedor completado com sucesso!",
      company,
      user: { id: userId, email: userEmail },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await CompanyModel.findById(id);
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, plan } = req.body;
    const data = await CompanyModel.update(id, { name, plan });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    await CompanyModel.delete(id);
    res.json({ message: "Registro excluído com sucesso." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
