const supabaseAdmin = require("../config/supabaseAdmin");

class PointsModel {
  static async create(pointData) {
    const { data, error } = await supabaseAdmin
      .from("pointers")
      .insert([pointData])
      .select();

    if (error) throw new Error(error.message);
    return data[0];
  }

  static async findByUserId(userId) {
    const { data, error } = await supabaseAdmin
      .from("pointers")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  static async findByCompanyId(companyId) {
    const { data, error } = await supabaseAdmin
      .from("pointers")
      .select("*, users:user_id (name, email)")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabaseAdmin
      .from("pointers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async update(id, updateData) {
    const { data, error } = await supabaseAdmin
      .from("pointers")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  static async delete(id, userId) {
    const { error } = await supabaseAdmin
      .from("pointers")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return true;
  }
}

module.exports = PointsModel;
