const UserModel = require("../models/userModel");
const AuthModel = require("../models/authModel");
const supabase = require("../config/supabase");

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "O e-mail é obrigatório." });
    }

    const redirectBase = process.env.FRONTEND_URL || "http://localhost:3000";

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${redirectBase}/update-password`,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({
      message:
        "Se o e-mail estiver cadastrado, você receberá um link de recuperação.",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Erro interno ao processar solicitação." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "A nova senha é obrigatória." });
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: "Senha alterada com sucesso!" });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao atualizar a senha." });
  }
};

exports.listUsersByCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await UserModel.findByCompanyId(id);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updatedUser = await UserModel.update(id, { name, email });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await UserModel.delete(id);
    res.json({ message: "Registro excluído com sucesso." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
