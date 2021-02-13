import Router from '@koa/router';
import { router as sessionRouter } from './session.mjs';
import { router as accountRouter } from './accounts.mjs';

export const router = new Router();

router.use('/auth', sessionRouter.routes(), sessionRouter.allowedMethods());
router.use('/auth', accountRouter.routes(), accountRouter.allowedMethods());

