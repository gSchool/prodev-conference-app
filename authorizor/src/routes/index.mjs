import Router from '@koa/router';
import { router as sessionRouter } from './session.mjs';
import { router as accountRouter } from './accounts.mjs';
import { router as authorizationRouter } from './authorization.mjs';

export const router = new Router();

router.use('/api', sessionRouter.routes(), sessionRouter.allowedMethods());
router.use('/api', accountRouter.routes(), accountRouter.allowedMethods());
router.use('/api', authorizationRouter.routes(), authorizationRouter.allowedMethods());

