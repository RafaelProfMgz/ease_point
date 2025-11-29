const express = require("express");
const router = express.Router();
const controller = require("../controllers/pointsController");
const authMiddleware = require("../middlewares/authMiddleware");

// Aplica proteção em TODAS as rotas de pontos
router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     Point:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         user_id:
 *           type: string
 *           format: uuid
 *         company_id:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *           description: "Tipo do registro (ex: ENTRADA, SAIDA, INTERVALO)"
 *         description:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *     PointInput:
 *       type: object
 *       required:
 *         - type
 *       properties:
 *         type:
 *           type: string
 *           example: "ENTRADA"
 *           description: "Tipo do registro (ex: ENTRADA, SAIDA)"
 *         description:
 *           type: string
 *           example: "Início do expediente"
 */

/**
 * @swagger
 * tags:
 *   name: Points
 *   description: Gerenciamento de registro de pontos
 */

/**
 * @swagger
 * /points:
 *   post:
 *     summary: Registrar um novo ponto
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PointInput'
 *     responses:
 *       201:
 *         description: Ponto registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Point'
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.post("/", controller.registerPoint);

/**
 * @swagger
 * /points:
 *   get:
 *     summary: Listar meus pontos (do usuário logado)
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pontos retornada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Point'
 */
router.get("/", controller.listMyPoints);

/**
 * @swagger
 * /points/company/{id}:
 *   get:
 *     summary: Listar pontos de uma empresa inteira
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da empresa
 *     responses:
 *       200:
 *         description: Lista de pontos da empresa
 */
router.get("/company/:id", controller.listPointsByCompany);

/**
 * @swagger
 * /points/{id}:
 *   get:
 *     summary: Buscar um ponto específico pelo ID
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do ponto
 *     responses:
 *       200:
 *         description: Detalhes do ponto
 *       404:
 *         description: Ponto não encontrado
 */
router.get("/:id", controller.findPointById);

/**
 * @swagger
 * /points/{id}:
 *   put:
 *     summary: Atualizar um ponto (Correção)
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do ponto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PointInput'
 *     responses:
 *       200:
 *         description: Ponto atualizado
 */
router.put("/:id", controller.updatePoint);

/**
 * @swagger
 * /points/{id}:
 *   delete:
 *     summary: Deletar um ponto
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do ponto
 *     responses:
 *       200:
 *         description: Ponto deletado
 */
router.delete("/:id", controller.deletePoint);

module.exports = router;
