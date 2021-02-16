import { pool } from '../db/index.mjs';
import Router from '@koa/router';
import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";

export const router = new Router({
  prefix: '/authorizor',
});

dotenv.config();

const secret = process.env['JWT_SECRET']
  if (secret === undefined || secret.length === 0) {
  console.error('ERROR: Missing JWT_SECRET environment variable.');
  process.exit(2);
}


router.put('verify', '/verify', async ctx => {
  console.log('verify endpoint called')
  let { auth } = ctx.request.body;

  if (auth && auth.startsWith('Bearer ')) {
    let token = auth.substring(7);
    try {
      let claims = verifyToken(token);
      ctx.status = 201;
      ctx.body = { claims };
    } catch (e) {
      console.error('INVALID TOKEN!')
      console.error(decodeToken(token));
      console.error(e);
      ctx.status = 401;
      ctx.body = {
        code: 'BAD_CREDENTIALS',
        message: 'Could not verify token.',
      };
    }
  } else {
    console.error('Unexpected payload without Bearer: ', auth)
    ctx.status = 400;
    ctx.body = {
      code: 'BAD_CREDENTIALS',
      message: 'Could not verify token.',
    };
  }
});


router.put('identify', '/identify', async ctx => {
  console.log('identify endpoint called', ctx.request.body)
  let {email} = ctx.request.body;
  let {rows} = await pool.query(`
    SELECT id FROM accounts WHERE email = $1
  `, [email]);
  if (rows.length === 1) {
    ctx.status = 201;
    ctx.body = {id: rows[0].id};
  } else {
    console.error('Failed to find ', email)
    ctx.status = 400;
    ctx.body = {
      code: 'BAD_CREDENTIALS',
      message: 'Could not find account with email.',
    };
  }
});


export function verifyToken(token) {
  return jwt.verify(token, secret);
}

export function decodeToken(token) {
   return jwt.decode(token, secret);
}