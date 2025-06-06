import { Pool } from "pg";
import { config } from "dotenv";
config();

export default new Pool({
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_DB,
  password: process.env.DATABASE_USER_PASSWORD,
  port: Number(process.env.DATABASE_PORT)
});

/*
Alternative -> Connection URL

// Again, this should be read from an environment variable
module.exports = new Pool({
  connectionString: "postgresql://<role_name>:<role_password>@localhost:5432/top_users"
});

*/1
