export const MAKEMAINTABLES = `
  CREATE TABLE IF NOT EXISTS "users" (
    "first_name" varchar(150) NOT NULL,
    "last_name" varchar(150) NOT NULL,
    "username" varchar(150) NOT NULL UNIQUE,
    "password" varchar(150) NOT NULL,
    "created_at" varchar(255) NOT NULL DEFAULT 'now',
    "id" serial NOT NULL,
    "membership" bigint NOT NULL,
    PRIMARY KEY ("id")
  );

  CREATE TABLE IF NOT EXISTS "membership_status" (
    "code" serial NOT NULL,
    "name" varchar(50) NOT NULL UNIQUE,
    PRIMARY KEY ("code")
  );

  CREATE TABLE IF NOT EXISTS "messages" (
    "id" serial NOT NULL,
    "user_id" bigint NOT NULL,
    "title" varchar(255) NOT NULL,
    "message" varchar(255) NOT NULL,
    "created_at" varchar(255) NOT NULL DEFAULT 'now',
    PRIMARY KEY ("id")
  );

  ALTER TABLE "users" ADD CONSTRAINT "users_fk6" FOREIGN KEY ("membership") REFERENCES "membership_status"("code");

  ALTER TABLE "messages" ADD CONSTRAINT "messages_fk1" FOREIGN KEY ("user_id") REFERENCES "users"("id");
`;

//command not yet tested
//export const CLEARDB = `
//    TRUNCATE TABLE cafe_inventory.users, cafe_inventory.product_categories, cafe_inventory.status, cafe_inventory.products, cafe_inventory.cart RESTART IDENTITY CASCADE;
//`