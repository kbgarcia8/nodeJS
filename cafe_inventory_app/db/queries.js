import pool from "./pool.js";

export async function getCategories() {
  const { rows } = await pool.query(`
      SELECT * FROM cafe_inventory.product_categories;
  `)
  return rows;
};