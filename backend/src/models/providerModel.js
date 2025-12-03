const supabaseAdmin = require("../config/supabaseAdmin");

class ProviderModel {
  static async getOAuthUrl(provider) {
    const { data, error } = await supabaseAdmin.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: "http://localhost:3000/callback",
      },
    });

    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = ProviderModel;
