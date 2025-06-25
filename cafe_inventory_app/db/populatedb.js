#! /usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import { Client } from "pg";
import * as sql from "./sql_commands.js"

async function main() {
  const command = sql.POPULATEDB;
  console.log(`executing sql command: ${command}`);
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: true,
    ca: process.env.DATABASE_SSL_CA?.replace(/\\n/g, '\n'), // To properly format multi-line certs
  },
  });

  await client.connect();
  await client.query(command);
  await client.end();
  console.log("done");
}

main();