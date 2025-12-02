const supabase = require("../config/supabase");

class AuthModel {
  static async login({ email, password }) {
    const result = await supabase.auth.signInWithPassword({ email, password });
    return result;
  }

  static async signUp({ email, password }) {
    const result = await supabase.auth.signUp({
      email,
      password,
    });

    return result;
  }

  static async getOAuthUrl(provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: "http://localhost:3000/dashboard",
      },
    });

    if (error) throw new Error(error.message);
    return data;
  }

  static async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    return true;
  }
}

module.exports = AuthModel;
