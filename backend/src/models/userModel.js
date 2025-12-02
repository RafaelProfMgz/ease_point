const supabaseAdmin = require("../config/supabaseAdmin");

class UserModel {
  static async findById(id) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async findByCompanyId(companyId) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("company_id", companyId);

    if (error) throw new Error(error.message);
    return data;
  }

  static async update(id, updateData) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  static async delete(id) {
    const { error } = await supabaseAdmin.from("users").delete().eq("id", id);

    if (error) throw new Error(error.message);
    return true;
  }
}

module.exports = UserModel;
