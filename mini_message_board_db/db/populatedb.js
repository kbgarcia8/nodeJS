#! /usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import { Client } from "pg";

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 30 ) NOT NULL UNIQUE,
  email VARCHAR ( 35 ) NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  message VARCHAR ( 300 ),
  dateandtime TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD HH12:MI:SS')
);

INSERT INTO users (username, email)
VALUES
  ('Amando', 'amando123@mailinator.com'),
  ('Charles', 'charles.dev@testmail.com'),
  ('Sophia', 'sophia_88@example.org'),
  ('Liam', 'liam.smith@demo.com'),
  ('Mia', 'mia01@maildrop.cc'),
  ('Noah', 'noah_jr@example.net'),
  ('Olivia', 'olivia.dev@temp-mail.org'),
  ('Ethan', 'ethan007@fakemail.com'),
  ('Ava', 'ava_luv@mail.test'),
  ('James', 'james123@mockmail.io');


INSERT INTO messages (user_id, message)
VALUES
  (1,'Hi there!"'),
  (2,'Hello World!'),
  (3,'How''s everyone doing?'),
  (4,'Just finished my work!'),
  (5,'Anyone up for a game later?'),
  (6,'Good morning!'),
  (7,'What''s the plan for today?'),
  (8,'Can''t wait for the weekend!'),
  (9,'Just saw an amazing movie.'),
  (10,'Any book recommendations?');
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: true,
    ca: process.env.DATABASE_SSL_CA?.replace(/\\n/g, '\n'), // To properly format multi-line certs
  },
  });

  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();

//console.log(process.env.DATABASE_SSL_CA?.replace(/\\n/g, '\n'))