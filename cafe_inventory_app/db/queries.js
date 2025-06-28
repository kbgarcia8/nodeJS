import pool from "./pool.js";

export async function getCategories() {
  const { rows } = await pool.query(`
      SELECT * FROM cafe_inventory.product_categories;
  `)
  return rows;
};

export async function getAllProducts() {
  const { rows } = await pool.query(`
    SELECT 
      p.product_code AS code,
      p.name AS name,
      p.product_category_id AS category,
      p.status_code AS status,
      p.description AS description,
      p.photo_url AS image,
      MAX(CASE WHEN pv.size = 'Solo' THEN pv.price END) AS solo,
      MAX(CASE WHEN pv.size = 'Small' THEN pv.price END) AS small,
      MAX(CASE WHEN pv.size = 'Large' THEN pv.price END) AS large,
      MAX(CASE WHEN pv.size = 'For Share' THEN pv.price END) AS for_share
    FROM cafe_inventory.products AS p
    INNER JOIN cafe_inventory.price_variants AS pv
      ON pv.product_id = p.id
    GROUP BY
      p.id,
      p.product_code,
      p.name,
      p.product_category_id,
      p.description,
      p.photo_url
    ORDER BY p.id ASC;
  `);
  return rows;
}