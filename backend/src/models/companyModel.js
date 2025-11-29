const supabase = require("../config/supabase");

class CompanyModel {
  static async create({ name, plan }) {
    const { data, error } = await supabase
      .from("companies")
      .insert([{ name, plan }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async update(id, { name, plan }) {
    const { data, error } = await supabase
      .from("companies")
      .update({ name, plan })
      .eq("id", id)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  static async delete(id) {
    const { error } = await supabase.from("companies").delete().eq("id", id);

    if (error) throw new Error(error.message);
    return true;
  }
}

module.exports = CompanyModel;
