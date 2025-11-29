const express = require("express");
const router = express.Router();
const controller = require("../controllers/pointsController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Point:
 *       type: object
 *       required:
 *         - type
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do ponto
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID do usuário
 *         company_id:
 *           type: string
 *           format: uuid
 *           description: ID da empresa
 *         type:
 *           type: string
 *           description: Tipo do ponto (entrada/saida/intervalo)
 *         description:
 *           type: string
 *           description: Descrição ou observação do ponto
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *     PointInput:
 *       type: object
 *       required:
 *         - type
 *       properties:
 *         type:
 *           type: string
 *           description: Tipo do registro (ex: Entrada, Saída)
 *         description:
 *           type: string
 *           description: Observação opcional
 */

/**
 * @swagger
 * tags:
 *   name: Points
 *   description: Gerenciamento de registros de ponto
 */

/**
 * @swagger
 * /points:
 *   post:
 *     summary: Registra um novo ponto
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
 *       404:
 *         description: Perfil de usuário não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.post("/", controller.registerPoint);

/**
 * @swagger
 * /points:
 *   get:
 *     summary: Lista os pontos do usuário logado
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pontos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Point'
 *       500:
 *         description: Erro no servidor
 */
router.get("/", controller.listMyPoints);

/**
 * @swagger
 * /points/company/{id}:
 *   get:
 *     summary: Lista pontos por empresa
 *     tags: [Points]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da empresa
 *     responses:
 *       200:
 *         description: Lista de pontos da empresa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Point'
 *       500:
 *         description: Erro no servidor
 */
router.get("/company/:id", controller.listPointsByCompany);

/**
 * @swagger
 * /points/{id}:
 *   get:
 *     summary: Busca um ponto pelo ID
 *     tags: [Points]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do ponto
 *     responses:
 *       200:
 *         description: Detalhes do ponto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Point'
 *       400:
 *         description: Erro na requisição
 */
router.get("/:id", controller.findPointById);

/**
 * @swagger
 * /points/{id}:
 *   put:
 *     summary: Atualiza um ponto existente
 *     tags: [Points]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Point'
 *       500:
 *         description: Erro no servidor
 */
router.put("/:id", controller.updatePoint);

/**
 * @swagger
 * /points/{id}:
 *   delete:
 *     summary: Exclui um ponto
 *     tags: [Points]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do ponto
 *     responses:
 *       200:
 *         description: Registro excluído com sucesso
 *       500:
 *         description: Erro no servidor
 */
router.delete("/:id", controller.deletePoint);

module.exports = router;
