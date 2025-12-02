const UserModel = require("../models/userModel");
const AuthModel = require("../models/authModel");

exports.register = async (req, res) => {
  try {
    const { name, email, password, company_id } = req.body;

    const { data: authData, error: authError } = await AuthModel.signUp({
      email,
      password,
    });

    if (authError) return res.status(400).json({ error: authError.message });

    const newUser = await UserModel.create({
      id: authData.user.id,
      name,
      email,
      company_id,
      role: "employee",
    });

    res.status(201).json(newUser);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await AuthModel.login({
      email,
      password,
    });

    if (error) {
      console.error("Erro no Login Supabase:", error.message);

      return res
        .status(401)
        .json({ error: error.message || "Email ou senha inválidos" });
    }

    const userDetails = await UserModel.findById(data.user.id);

    if (!userDetails) {
      return res
        .status(404)
        .json({ error: "Usuário autenticado, mas perfil não encontrado." });
    }

    res.json({
      session: data.session,
      user: userDetails,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  const { error } = await AuthModel.logout();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Logout realizado com sucesso" });
};
