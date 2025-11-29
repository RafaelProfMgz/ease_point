const supabase = require("../config/supabase");

exports.registerPoint = async (req, res) => {
  const userId = req.user.id;
  const { type, description } = req.body;

  try {
    const { data: userProfile } = await supabase
      .from("users")
      .select("company_id")
      .eq("id", userId)
      .single();

    if (!userProfile)
      return res
        .status(404)
        .json({ error: "Perfil de usuário não encontrado." });

    const { data, error } = await supabase
      .from("pointers")
      .insert([
        {
          user_id: userId,
          company_id: userProfile.company_id,
          type,
          description,
        },
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listMyPoints = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("pointers")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.updatePoint = async (req, res) => {
  const { id } = req.params;
  const { type, description } = req.body;

  const { data, error } = await supabase
    .from("pointers")
    .update({ type, description })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.deletePoint = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("pointers").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Registro excluído com sucesso." });
};

exports.findPointById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("pointers")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

exports.listPointsByCompany = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("pointers")
    .select("*")
    .eq("company_id", id)
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
