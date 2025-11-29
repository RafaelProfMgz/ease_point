const supabase = require("../config/supabase");

class UserModel {
  static async create(data) {
    return await supabase.from("users").insert([data]).select().single();
  }

  static async findById(id) {
    return await supabase.from("users").select("*").eq("id", id).single();
  }

  static async findByCompany(companyId) {
    return await supabase.from("users").select("*").eq("company_id", companyId);
  }
}

module.exports = UserModel;
