/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Point:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         user_id:
 *           type: string
 *           format: uuid
 *         company_id:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *           enum: [ENTRADA, SAIDA, INTERVALO_INICIO, INTERVALO_FIM]
 *           description: "Tipo do registro de ponto"
 *           example: "ENTRADA"
 *         description:
 *           type: string
 *           example: "Chegada no escritório"
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     PointInput:
 *       type: object
 *       required:
 *         - type
 *       properties:
 *         type:
 *           type: string
 *           enum: [ENTRADA, SAIDA, INTERVALO_INICIO, INTERVALO_FIM]
 *           description: "Tipo deve ser um dos valores permitidos"
 *           example: "ENTRADA"
 *         description:
 *           type: string
 *           example: "Início do expediente remoto"
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Erro inesperado ao processar a requisição"
 *
 *   parameters:
 *     pointId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *       description: ID único do ponto (UUID)
 *
 *     companyId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *       description: ID da empresa
 *
 *   responses:
 *     UnauthorizedError:
 *       description: Token de acesso ausente ou inválido
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     NotFoundError:
 *       description: Recurso não encontrado
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * tags:
 *   name: Points
 *   description: Gerenciamento de registros de jornada de trabalho
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
 *       400:
 *         description: "Dados inválidos (ex: tipo incorreto)"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /points:
 *   get:
 *     summary: Listar meus pontos (usuário logado)
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pontos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Point'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /points/company/{id}:
 *   get:
 *     summary: Listar pontos de uma empresa inteira
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/companyId'
 *     responses:
 *       200:
 *         description: Lista de pontos da empresa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Point'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Usuário não tem permissão de admin
 */

/**
 * @swagger
 * /points/{id}:
 *   get:
 *     summary: Buscar um ponto específico pelo ID
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pointId'
 *     responses:
 *       200:
 *         description: Detalhes do ponto encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Point'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /points/{id}:
 *   put:
 *     summary: Atualizar/Corrigir um ponto
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pointId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PointInput'
 *     responses:
 *       200:
 *         description: Ponto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Point'
 *       400:
 *         description: Erro de validação nos dados enviados
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /points/{id}:
 *   delete:
 *     summary: Deletar um registro de ponto
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pointId'
 *     responses:
 *       200:
 *         description: Ponto removido com sucesso
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
