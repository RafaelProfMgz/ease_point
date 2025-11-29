const express = require("express");
const router = express.Router();
const controller = require("../controllers/companyController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         id: { type: string, format: uuid }
 *         name: { type: string }
 *         plan: { type: string, enum: [bronze, prata, ouro] }
 *     RegisterCompanyInput:
 *       type: object
 *       required: [companyName, plan, adminName, email, password]
 *       properties:
 *         companyName: { type: string, example: "Minha Empresa Ltda" }
 *         plan:
 *           type: string
 *           enum: [bronze, prata, ouro]
 *           description: "Plano escolhido"
 *         adminName: { type: string, example: "João Admin" }
 *         email: { type: string, example: "mangazaorig@gmail.com" }
 *         password: { type: string, example: "senhaForte123" }
 */

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Gestão de empresas e planos
 */

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Registrar nova Empresa e Admin (Cadastro Inicial)
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterCompanyInput'
 *     responses:
 *       201:
 *         description: Empresa e Admin criados com sucesso
 *       400:
 *         description: "Erro: Plano inválido ou dados incorretos"
 */
router.post("/", controller.createCompany);

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Buscar empresa por ID (Público)
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Dados da empresa
 *       404:
 *         description: Empresa não encontrada
 */
router.get("/:id", controller.findCompanyById);

/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Atualizar empresa
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               plan: { type: string, enum: [bronze, prata, ouro] }
 *     responses:
 *       200:
 *         description: Empresa atualizada
 */
router.put("/:id", authMiddleware, controller.updateCompany);

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Deletar empresa
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Empresa removida
 */
router.delete("/:id", authMiddleware, controller.deleteCompany);

/**
 * @swagger
 * /companies/google-setup:
 *   post:
 *     summary: Finaliza cadastro de empresa após login Google
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [companyName, plan, adminName]
 *             properties:
 *               companyName: { type: string }
 *               plan: { type: string, enum: [bronze, prata, ouro] }
 *               adminName: { type: string }
 *     responses:
 *       201:
 *         description: Cadastro finalizado e vinculado
 */
router.post(
  "/google-setup",
  authMiddleware,
  controller.completeGoogleRegistration
);

// ... outras rotas

module.exports = router;
