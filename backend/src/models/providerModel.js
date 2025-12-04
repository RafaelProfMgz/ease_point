const supabaseAdmin = require("../config/supabaseAdmin");

class ProviderModel {
  static async getOAuthUrl(provider) {
    const urlFromEnv = process.env.FRONTEND_URL || "http://localhost:3000";
    const redirectBase = urlFromEnv.replace(/\/$/, "");

    console.log("Gerando URL de OAuth para:", redirectBase);

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
