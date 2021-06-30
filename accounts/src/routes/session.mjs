import { pool } from '../db/index.mjs';
import Router from '@koa/router';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import boom from '@hapi/boom';

dotenv.config();

const DEFAULT_HASH = '$2a$10$QlWNohhjpbGuty6UnyeeJOeKY6dKbiaoFxeWdOoIUiNYaO/ZD2khW';

const secret = process.env['JWT_SECRET']
if (secret === undefined || secret.length === 0) {
  console.error('ERROR: Missing JWT_SECRET environment variable.');
  process.exit(2);
}

export const router = new Router({
  prefix: '/session',
});

const delayInitValue = 20;
let delay = delayInitValue;

// reset delay every 20 seconds
setInterval(() => {
  if (delay !== delayInitValue) {
    delay = delayInitValue;
    console.log("Resetting flakey service delay to", delay);
  }
}, 20000);

router.get("/flakeyService", (req, res) => {
  console.log("Flakey service delay", delay);
  // if we're really slowing down, just reply with an error
  if (delay > 1000) {
    console.log("Long delay encountered, returning Error 423 (Locked)");
    const {
      output: { statusCode, payload },
    } = boom.locked("Flakey service is flakey");
    res.status(statusCode).send(payload);
    return;
  }

  setTimeout(() => {
    console.log("Replying with flakey response after delay of", delay);
    delay = delay * 2;
    res.send({
      body: "Flakey service response",
      delay,
    });
  }, delay);
});

router.put('new_session', '/', async ctx => {
  let { email, password } = ctx.request.body;
  email = email.toLowerCase().trim();
  password = password.trim();
  const { rows } = await pool.query(`
    SELECT name, hashed_password
    FROM accounts
    WHERE email = $1`,
    [email]
  );
  let hash = DEFAULT_HASH;
  if (rows.length === 0) {
    password = '';
  } else {
    hash = rows[0].hashed_password;
  }
  const good = await bcrypt.compare(password, hash) && rows.length === 1;
  if (good) {
    const token = jwt.sign({ name: rows[0].name, email }, secret);
    ctx.status = 201;
    ctx.body = { token };
  } else {
    ctx.status = 404;
    ctx.body = {
      code: 'BAD_CREDENTIALS',
      message: 'Could not authenticate with those credentials'
    };
  }
});
