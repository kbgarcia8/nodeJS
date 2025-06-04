import { Pool } from "pg";

// All of the following properties should be read from environment variables
// We're hardcoding them here for simplicity
export default new Pool({
  host: "localhost", // or wherever the db is hosted
  user: "kbgarcia",
  database: "top_users",
  password: "icandothis151318",
  port: 5432 // The default port
});
/*
Alternative -> Connection URL

// Again, this should be read from an environment variable
module.exports = new Pool({
  connectionString: "postgresql://<role_name>:<role_password>@localhost:5432/top_users"
});

*/
