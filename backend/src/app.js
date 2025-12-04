const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");

const companyRoutes = require("./routes/companies");
const userRoutes = require("./routes/users");
const pointsRoutes = require("./routes/points");
const authRoutes = require("./routes/auth");
const providerRoutes = require("./routes/provider");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  (process.env.FRONTEND_URL || "").replace(/\/$/, ""),
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Bloqueado pelo CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ease Point API</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #0F172A; /* Cor de fundo do seu tema */
                color: #E2E8F0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .card {
                background-color: #1E293B; 
                padding: 2rem;
                border-radius: 16px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                text-align: center;
                max-width: 400px;
                width: 90%;
                border: 1px solid #334155;
            }
            h1 { margin-bottom: 0.5rem; color: #38BDF8; }
            p { margin-bottom: 1.5rem; color: #94A3B8; }
            .btn {
                display: inline-block;
                background-color: #38BDF8; 
                color: #0F172A;
                padding: 12px 24px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
                transition: background-color 0.2s;
            }
            .btn:hover { background-color: #0EA5E9; }
            .status-dot {
                height: 10px; width: 10px;
                background-color: #10B981; 
                border-radius: 50%;
                display: inline-block;
                margin-right: 8px;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>Ease Point API</h1>
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <span class="status-dot"></span>
                <small>Sistema Operacional</small>
            </div>
            <p>O backend está rodando corretamente. Para saber como integrar, acesse a documentação.</p>
            
            <a href="/api-docs" class="btn">Acessar Documentação</a>
        </div>
    </body>
    </html>
  `;

  res.send(htmlContent);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/companies", companyRoutes);
app.use("/users", userRoutes);
app.use("/points", pointsRoutes);
app.use("/auth", authRoutes);
app.use("/provider", providerRoutes);

module.exports = app;
