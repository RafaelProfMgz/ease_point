const supabase = require("../config/supabase");

exports.createCompany = async (req, res) => {
  const { companyName, plan, adminName, email, password } = req.body;

  const validPlans = ["bronze", "prata", "ouro"];
  if (!validPlans.includes(plan)) {
    return res
      .status(400)
      .json({ error: "Plano inválido. Escolha: bronze, prata ou ouro." });
  }

  try {
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert([{ name: companyName, plan }])
      .select()
      .single();

    if (companyError) throw companyError;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      await supabase.from("companies").delete().eq("id", company.id);
      return res
        .status(400)
        .json({ error: "Erro ao criar autenticação: " + authError.message });
    }

    const { error: profileError } = await supabase.from("users").insert([
      {
        id: authData.user.id,
        name: adminName,
        email: email,
        company_id: company.id,
        role: "admin",
      },
    ]);

    if (profileError) {
      await supabase.auth.api.deleteUser(authData.user.id);
      await supabase.from("companies").delete().eq("id", company.id);
      return res.status(400).json({
        error: "Erro ao criar perfil de usuário: " + profileError.message,
      });
    }

    res.status(201).json({
      message: "Empresa e Administrador criados com sucesso!",
      company: company,
      user: { id: authData.user.id, email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findCompanyById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

exports.updateCompany = async (req, res) => {
  const { id } = req.params;
  const { name, plan } = req.body;

  const { data, error } = await supabase
    .from("companies")
    .update({ name, plan })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.deleteCompany = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("companies").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Registro excluído com sucesso." });
};
