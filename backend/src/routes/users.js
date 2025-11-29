const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         company_id:
 *           type: string
 *           format: uuid
 *         role:
 *           type: string
 *           description: "Papel do usuário (ex: admin, employee)"
 *     LoginInput:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email: { type: string, example: "admin@empresa.com" }
 *         password: { type: string, example: "123456" }
 *     CreateEmployeeInput:
 *       type: object
 *       required: [name, email, password, company_id]
 *       properties:
 *         name: { type: string }
 *         email: { type: string }
 *         password: { type: string }
 *         company_id: { type: string, format: uuid }
 *     AuthResponse:
 *       type: object
 *       properties:
 *         session: { type: object, description: "Token JWT do Supabase" }
 *         user: { $ref: '#/components/schemas/User' }
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestão de usuários
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Realizar Login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Sucesso (Retorna Token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", controller.login);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Criar novo funcionário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmployeeInput'
 *     responses:
 *       201:
 *         description: Funcionário criado
 *       400:
 *         description: "Erro (ex: email já existe)"
 */
router.post("/register", controller.createEmployee);

// --- ROTAS PROTEGIDAS ---

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar todos os usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa
 */
router.get("/", authMiddleware, controller.listUsers);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Buscar usuário por email (Query Param)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email exato do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 */
router.get("/search", authMiddleware, controller.searchUser);

/**
 * @swagger
 * /users/company/{id}:
 *   get:
 *     summary: Listar usuários de uma empresa
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista de funcionários
 */
router.get("/company/:id", authMiddleware, controller.listUsersByCompany);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Detalhes do usuário
 */
router.get("/:id", authMiddleware, controller.findUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     tags: [Users]
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
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Atualizado com sucesso
 */
router.put("/:id", authMiddleware, controller.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deletar usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Usuário removido
 */
router.delete("/:id", authMiddleware, controller.deleteUser);

/**
 * @swagger
 * /users/auth/google:
 *   get:
 *     summary: Obtém URL para login com Google
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Retorna a URL de redirecionamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url: { type: string }
 */
router.get("/auth/google", controller.getGoogleUrl);

module.exports = router;
