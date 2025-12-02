/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gestão de autenticação
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realizar Login
 *     tags: [Auth]
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

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Deslogar
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deslogado
 */
