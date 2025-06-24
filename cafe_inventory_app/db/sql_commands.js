/*const SQL = `
CREATE TABLE IF NOT EXISTS message_board.users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 30 ) NOT NULL UNIQUE,
  email VARCHAR ( 35 ) NOT NULL
);

CREATE TABLE IF NOT EXISTS message_board.messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER REFERENCES message_board.users(id) ON DELETE CASCADE,
  message VARCHAR ( 300 ),
  dateandtime TIMESTAMP DEFAULT NOW()
);

INSERT INTO message_board.users (username, email)
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


INSERT INTO message_board.messages (user_id, message)
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
`;*/


export const MAKEMAINTABLES = `
  CREATE TABLE IF NOT EXISTS cafe_inventory.users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR ( 30 ) NOT NULL UNIQUE,
    email VARCHAR ( 50 ) NOT NULL,
    first_name VARCHAR ( 50 ) NOT NULL,
    last_name VARCHAR ( 50 ) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    photo_url TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS cafe_inventory.product_categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 30 ) NOT NULL UNIQUE
  );

    CREATE TABLE IF NOT EXISTS cafe_inventory.status (
    code INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 20 ) NOT NULL UNIQUE,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS cafe_inventory.products (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_code VARCHAR ( 30 ) NOT NULL UNIQUE,
    name VARCHAR ( 50 ) NOT NULL UNIQUE,
    price INTEGER NOT NULL,
    size VARCHAR ( 10 ) NOT NULL,
    status_code INTEGER REFERENCES cafe_inventory.status(code) ON DELETE CASCADE,
    product_category_id INTEGER REFERENCES cafe_inventory.product_categories(id) ON DELETE CASCADE,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS cafe_inventory.cart (
    user_id INTEGER REFERENCES cafe_inventory.users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES cafe_inventory.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    last_updated TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id)
  );

`;
//format [TIMESTAMP DEFAULT NOW()] to TO_CHAR(<column_name>, 'YYYY-MM-DD HH12:MI:SS') AS <column_alias>
//Do this in querying not in defining schema

export const ADDSTATUS = `
    INSERT INTO cafe_inventory.status (name, description)
    VALUES
        ('Available'	,'In stock and orderable'),
        ('Low Stock','Running low — show a warning badge'),
        ('Out of Stock','Cannot be ordered'),
        ('Seasonal','Only available during some months'),
        ('Discontinued','No longer offere');
`;

export const ADDPRODCATEGORIES = `
    INSERT INTO cafe_inventory.product_categories (name)
    VALUES
        ('Iced Drink'),
        ('Hot Drink'),
        ('Cakes'),
        ('Pastries'),
        ('Pasta'),
        ('Mains'),
        ('Sides');
`;

//command not yet tested
export const CLEARDB = `
    TRUNCATE TABLE cafe_inventory.users, cafe_inventory.product_categories, cafe_inventory.status, cafe_inventory.products, cafe_inventory.cart RESTART IDENTITY CASCADE;
`