const supabaseAdmin = require("../config/supabaseAdmin");

class ProviderModel {
  static async getOAuthUrl(provider) {
    const redirectBase = process.env.FRONTEND_URL || "http://localhost:3000";

    const { data, error } = await supabaseAdmin.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${redirectBase}/callback`,
      },
    });

    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = ProviderModel;
