/* eslint-disable import/no-named-default */
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from '../../config/swagger';
import { default as LoginRouter } from './login.route';
import { default as AuthorizeRouter } from './authorize.route';

const router = express.Router();

/**
 * @swagger
 *
 * /status:
 *  get:
 *    description: Status of the application
 *    tags:
 *      - status
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: status
 */
router.get('/status', (req, res) => {
  res.json({ status: 'OK' });
});

router.use(LoginRouter);
router.use(AuthorizeRouter);

router.post('/user');

router.get('/user/activate/:token');

router.get('/forgoten');
router.post('/forgoten');
router.get('/forgoten/:token');
router.post('/forgoten/:token');

router.get('/user');
router.delete('/user');

router.get('/user/me');
router.put('/user/me');
router.delete('/user/me');

router.get('/user/:id');
router.put('/user/:id');
router.delete('/user/:id');

router.use('/api-docs/auth', swaggerUi.serve);
router.get('/api-docs/auth', swaggerUi.setup(swaggerSpecs));

router.get('/api-docs/auth/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});

export default router;
