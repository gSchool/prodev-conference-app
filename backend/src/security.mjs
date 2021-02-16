import {call} from "./serviceBase.mjs";

export async function authorize(ctx, next) {
  if (ctx.claims === undefined) {
    ctx.status = 401;
    return ctx.body = {
      code: 'INVALID_TOKEN',
      message: 'The token provided is invalid.'
    }
  }
  await next();
}

export async function bearer(ctx, next) {
  const auth = ctx.get('Authorization');
  if (auth && auth.startsWith('Bearer ')) {
    ctx.claims = await checkAuthorization(auth);
  }

  await next();
}

export async function identify(ctx, next) {
  if (ctx.claims.email) {
    ctx.claims.id = await checkIdentity(ctx.claims.email)
  }
  await next();
}

async function checkAuthorization(auth) {
  let result = await call(`/authorizor/verify`, 'claims', 'put', [], {auth: auth});
  if (result.succeeded) {
    return result.claims.claims
  }
}
async function checkIdentity(email) {
  let result = await call(`/authorizor/identify`, 'id', 'put', [], {email: email});
  if (result.succeeded) {
    return result.id.id
  }
}