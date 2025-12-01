const UserModel = require("../models/userModel");
const AuthModel = require("../models/authModel");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await AuthModel.login({
      email,
      password,
    });

    if (error) {
      console.error("Erro no Login Supabase:", error.message); 
      
      return res.status(401).json({ error: error.message || "Email ou senha inválidos" });
    }

    const userDetails = await UserModel.findById(data.user.id);
    
    if (!userDetails) {
        return res.status(404).json({ error: "Usuário autenticado, mas perfil não encontrado." });
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

exports.createEmployee = async (req, res) => {
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

exports.listUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

exports.searchUser = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await UserModel.findByEmail(email);

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
