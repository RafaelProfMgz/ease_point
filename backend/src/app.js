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

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/companies", companyRoutes);
app.use("/users", userRoutes);
app.use("/points", pointsRoutes);
app.use("/auth", authRoutes);
app.use("/provider", providerRoutes);

module.exports = app;
