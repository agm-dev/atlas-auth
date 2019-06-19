import express from 'express';

const authorizeController = (req, res) => (res.json({ live: true }));

const router = express.Router();

/**
 * @swagger
 *
 * components:
 *  schemas:
 *    Token:
 *      type: object
 *      properties:
 *        access_token:
 *          type: string
 *      example:
 *        access_token: A9fsd98f7FDF9d7fvfsvd9D0HG97S9D0F
 */

/**
 * @swagger
 *
 * /authorize:
 *  post:
 *    description: Process authorization request
 *    tags:
 *      - login
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: email
 *        description: user email
 *        in: body
 *        required: true
 *        schema:
 *          type: string
 *          format: email
 *          example: real.fancy@email.com
 *      - name: password
 *        description: user password
 *        in: body
 *        required: true
 *        schema:
 *          type: string
 *          format: password
 *          example: Fuck1ngP455w0rd
 *    responses:
 *      200:
 *        description: successful login
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Token'
 *      201:
 *        description: successful sign up
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Token'
 *      401:
 *        description: failed log in or sign up
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                description:
 *                  type: string
 *              example:
 *                error: E689W234
 *                description: Used unsupported characters on password
 */
router.get('/authorize', authorizeController);

export default router;
