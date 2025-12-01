const supabase = require("../config/supabase");

class UserModel {
  static async create(userData) {
    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select();

    if (error) throw new Error(error.message);
    return data[0];
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async findAll() {
    const { data, error } = await supabase.from("users").select("*");

    if (error) throw new Error(error.message);
    return data;
  }

  static async findByCompanyId(companyId) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("company_id", companyId);

    if (error) throw new Error(error.message);
    return data;
  }

  static async update(id, updateData) {
    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  static async delete(id) {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) throw new Error(error.message);
    return true;
  }

  static async setResetToken(email, token, expires) {
    const { data, error } = await supabase
      .from("users")
      .update({
        reset_token: token,
        reset_expires: expires,
      })
      .eq("email", email)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  static async findByResetToken(token) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("reset_token", token)
      .gt("reset_expires", new Date().toISOString())
      .single();

    if (error) return null;
    return data;
  }

  static async updatePassword(id, newPassword) {
    const { data, error } = await supabase
      .from("users")
      .update({
        password: newPassword,
        reset_token: null,
        reset_expires: null,
      })
      .eq("id", id);

    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = UserModel;
