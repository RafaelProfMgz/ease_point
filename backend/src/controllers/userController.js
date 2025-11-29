/*************  ✨ Windsurf Command 🌟  *************/
const supabase = require("../config/supabase");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: "Email ou senha inválidos" });

  const { data: userDetails } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  res.json({
    session: data.session,
    session: data.session,
    user: userDetails,
  });
};

exports.logout = async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Logout realizado com sucesso" });
};

exports.createEmployee = async (req, res) => {
  const { name, email, password, company_id } = req.body;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) return res.status(400).json({ error: authError.message });

  const { data, error } = await supabase
    .from("users")
    .insert([
      { id: authData.user.id, name, email, company_id, role: "employee" },
    ])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
};

exports.listUsers = async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.listUsersByCompany = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("company_id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.findUserById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const { data, error } = await supabase
    .from("users")
    .update({ name, email })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Registro excluído com sucesso." });
};

exports.searchUser = async (req, res) => {
  const { email } = req.query;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
