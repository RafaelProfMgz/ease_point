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
  res.send("API do Sistema de Ponto está rodando");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/companies", companyRoutes);
app.use("/users", userRoutes);
app.use("/points", pointsRoutes);
app.use("/auth", authRoutes);
app.use("/provider", providerRoutes);

module.exports = app;
