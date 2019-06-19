import express from 'express';

const loginController = (req, res) => (res.json({ live: true }));

const router = express.Router();

/**
 * @swagger
 *
 * /login:
 *  get:
 *    description: Returns a login and sign up form
 *    tags:
 *      - login
 *    produces:
 *      - text/html
 *    responses:
 *      200:
 *        description: login and sign up form
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 */
router.get('/login', loginController);

export default router;
