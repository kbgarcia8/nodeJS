export const MAKEMAINTABLES = `
  CREATE TABLE authentication_basics.users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR ( 255 ),
    password VARCHAR ( 255 )
  );
`;

//command not yet tested
//export const CLEARDB = `
//    TRUNCATE TABLE cafe_inventory.users, cafe_inventory.product_categories, cafe_inventory.status, cafe_inventory.products, cafe_inventory.cart RESTART IDENTITY CASCADE;
//`