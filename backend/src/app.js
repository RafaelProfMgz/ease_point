const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");

const companyRoutes = require("./routes/companies");
const userRoutes = require("./routes/users");
const pointsRoutes = require("./routes/points");

const app = express();

app.use(cors());
app.use(express.json());

// Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Rotas
app.use("/companies", companyRoutes);
app.use("/users", userRoutes);
app.use("/points", pointsRoutes);

module.exports = app;
