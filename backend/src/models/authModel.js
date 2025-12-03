const supabaseAdmin = require("../config/supabaseAdmin");

class AuthModel {
  static async login({ email, password }) {
    const result = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });
    return result;
  }

  static async signUp({ email, password }) {
    const result = await supabaseAdmin.auth.signUp({
      email,
      password,
    });

    return result;
  }

  static async logout() {
    const { error } = await supabaseAdmin.auth.signOut();
    if (error) throw new Error(error.message);
    return true;
  }
}

module.exports = AuthModel;
