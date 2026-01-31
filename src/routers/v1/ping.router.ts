import express from 'express';
import { pingHandler } from '../../controllers/ping.controller';
import {  validateRequestBody } from '../../validators';
import { pingSchema } from '../../validators/ping.validator';
import { FixedWindow } from '../../middlewares/FixedWindow';

const pingRouter = express.Router();

pingRouter.get('/',FixedWindow,validateRequestBody(pingSchema), pingHandler); // TODO: Resolve this TS compilation issue

pingRouter.get('/health', (req, res) => {
    res.status(200).send('OK');
});

export default pingRouter;