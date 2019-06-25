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
// router.use(ProfileRouter); // get (form) put (update) delete (remove)
// router.use(JWTConfigRouter); // get (json with data to validate jwt)

router.get('/user/activate/:token');

router.get('/forgoten');
router.post('/forgoten');
router.get('/forgoten/:token');
router.post('/forgoten/:token');

router.use('/api-docs/auth', swaggerUi.serve);
router.get('/api-docs/auth', swaggerUi.setup(swaggerSpecs));

router.get('/api-docs/auth/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});

export default router;
