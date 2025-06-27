import pool from "./pool.js";

export async function getCategories() {
  const { rows } = await pool.query(`
      SELECT * FROM cafe_inventory.product_categories;
  `)
  return rows;
};

export async function getAllProducts() {
  const { rows } = await pool.query(`
      SELECT * FROM cafe_inventory.products;
  `);
  return rows;
}