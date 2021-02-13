import { pool } from '../db/index.mjs';
import Router from '@koa/router';
import bcrypt from 'bcryptjs';
import { trimProperty } from '../strings.mjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const DEFAULT_HASH = '$2a$10$QlWNohhjpbGuty6UnyeeJOeKY6dKbiaoFxeWdOoIUiNYaO/ZD2khW';

export const router = new Router({
  prefix: '/accounts',
});

router.post('new_account', '/', async ctx => {
  trimProperty(ctx.request.body, 'name');
  trimProperty(ctx.request.body, 'email');
  trimProperty(ctx.request.body, 'password');
  const v = await ctx.validator(ctx.request.body, {
    name: 'required|minLength:1',
    email: 'required|email',
    password: 'required|minLength:8',
  });
  const fails = await v.fails();
  if (fails) {
    ctx.status = 400;
    return ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not create a location because at least one of the values is bad.',
      errors: v.errors,
    };
  }

  let { name, email, password } = ctx.request.body;
  email = email.toLowerCase();
  const hash = await bcrypt.hash(password || '', 8);
  try {
    const { rows } = await pool.query(`
      INSERT INTO accounts (name, email, hashed_password)
      VALUES ($1, $2, $3)
      RETURNING created, updated
    `, [name, email, hash]);
    const { created, updated } = rows[0];
    const token = signToken({ name, email, created, updated });
    ctx.status = 201;
    ctx.body = { token };
  } catch (e) {
    console.error(e);
    ctx.status = 400;
    ctx.body = {
      code: 'BAD_CREDENTIALS',
      message: 'Could not create an account with those credentials.',
    };
  }
});

dotenv.config();

const secret = process.env['JWT_SECRET']
if (secret === undefined || secret.length === 0) {
  console.error('ERROR: Missing JWT_SECRET environment variable.');
  process.exit(2);
}

export function signToken(claims) {
  if (!Number.isInteger(claims.exp)) {
    claims.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
  }
  return jwt.sign(claims, secret);
}
