import pool from "./pool.js";

export async function getCategories() {
  const { rows } = await pool.query(`
      SELECT * FROM cafe_inventory.product_categories;
  `)
  return rows;
};

export async function getProductStatus() {
  const { rows } = await pool.query(`
      SELECT * FROM cafe_inventory.status;
  `)
  return rows;
};

export async function getAllProducts() {
  const { rows } = await pool.query(`
    SELECT
      p.id AS id,
      p.product_code AS code,
      p.name AS name,
      p.product_category_id AS category_code,
      pc.name AS category_name,
      p.status_code AS status_code,
      s.name AS status_name,
      p.description AS description,
      p.photo_url AS image,
      MAX(CASE WHEN pv.size = 'Solo' THEN pv.price END) AS solo,
      MAX(CASE WHEN pv.size = 'Small' THEN pv.price END) AS small,
      MAX(CASE WHEN pv.size = 'Large' THEN pv.price END) AS large,
      MAX(CASE WHEN pv.size = 'For Share' THEN pv.price END) AS for_share
    FROM cafe_inventory.products AS p
    INNER JOIN cafe_inventory.price_variants AS pv
      ON pv.product_id = p.id
    INNER JOIN cafe_inventory.product_categories AS pc
      ON pc.id = p.product_category_id    
    INNER JOIN cafe_inventory.status AS s
      ON s.code = p.status_code
    GROUP BY
      s.name,
      pc.name,
      p.id,
      p.product_code,
      p.name,
      p.product_category_id,
      p.description,
      p.photo_url
    ORDER BY p.id ASC;
  `);
  return rows;
};

export async function getFilteredProductsById(id) {
  const { rows } = await pool.query(`
    SELECT 
      p.id AS id,
      p.product_code AS code,
      p.name AS name,
      s.name AS status_name,
      pc.name AS category,
      p.description AS description,
      p.photo_url AS image,
      MAX(CASE WHEN pv.size = 'Solo' THEN pv.price END) AS solo,
      MAX(CASE WHEN pv.size = 'Small' THEN pv.price END) AS small,
      MAX(CASE WHEN pv.size = 'Large' THEN pv.price END) AS large,
      MAX(CASE WHEN pv.size = 'For Share' THEN pv.price END) AS for_share
    FROM cafe_inventory.products AS p
    INNER JOIN cafe_inventory.price_variants AS pv
      ON pv.product_id = p.id
    INNER JOIN cafe_inventory.product_categories AS pc
      ON pc.id = p.product_category_id    
    INNER JOIN cafe_inventory.status AS s
      ON s.code = p.status_code
    WHERE p.id = $1
    GROUP BY
      s.name,
      pc.name,
      p.id,
      p.product_code,
      p.name,
      p.product_category_id,
      p.description,
      p.photo_url;
  `,[id]);
  return rows;
};

export async function getFilteredProductsByProductCode(code) {
  const { rows } = await pool.query(`
    SELECT 
      p.id AS id,
      p.product_code AS code,
      p.name AS name,
      s.name AS status_name,
      pc.name AS category,
      p.description AS description,
      p.photo_url AS image,
      MAX(CASE WHEN pv.size = 'Solo' THEN pv.price END) AS solo,
      MAX(CASE WHEN pv.size = 'Small' THEN pv.price END) AS small,
      MAX(CASE WHEN pv.size = 'Large' THEN pv.price END) AS large,
      MAX(CASE WHEN pv.size = 'For Share' THEN pv.price END) AS for_share
    FROM cafe_inventory.products AS p
    INNER JOIN cafe_inventory.price_variants AS pv
      ON pv.product_id = p.id
    INNER JOIN cafe_inventory.product_categories AS pc
      ON pc.id = p.product_category_id    
    INNER JOIN cafe_inventory.status AS s
      ON s.code = p.status_code
    WHERE p.product_code = $1
    GROUP BY
      s.name,
      pc.name,
      p.id,
      p.product_code,
      p.name,
      p.product_category_id,
      p.description,
      p.photo_url;
  `,[code]);
  return rows;
};

export async function getFilteredProductsByName(name) {
  const { rows } = await pool.query(`
    SELECT 
      p.id AS id,
      p.product_code AS code,
      p.name AS name,
      s.name AS status_name,
      pc.name AS category,
      p.description AS description,
      p.photo_url AS image,
      MAX(CASE WHEN pv.size = 'Solo' THEN pv.price END) AS solo,
      MAX(CASE WHEN pv.size = 'Small' THEN pv.price END) AS small,
      MAX(CASE WHEN pv.size = 'Large' THEN pv.price END) AS large,
      MAX(CASE WHEN pv.size = 'For Share' THEN pv.price END) AS for_share
    FROM cafe_inventory.products AS p
    INNER JOIN cafe_inventory.price_variants AS pv
      ON pv.product_id = p.id
    INNER JOIN cafe_inventory.product_categories AS pc
      ON pc.id = p.product_category_id    
    INNER JOIN cafe_inventory.status AS s
      ON s.code = p.status_code
    WHERE p.name = $1
    GROUP BY
      s.name,
      pc.name,
      p.id,
      p.product_code,
      p.name,
      p.product_category_id,
      p.description,
      p.photo_url;
  `,[name]);
  return rows;
};

export async function getFilteredProductsByStatus(status) {
  const { rows } = await pool.query(`
    SELECT 
      p.id AS id,
      p.product_code AS code,
      p.name AS name,
      s.name AS status_name,
      pc.name AS category,
      p.description AS description,
      p.photo_url AS image,
      MAX(CASE WHEN pv.size = 'Solo' THEN pv.price END) AS solo,
      MAX(CASE WHEN pv.size = 'Small' THEN pv.price END) AS small,
      MAX(CASE WHEN pv.size = 'Large' THEN pv.price END) AS large,
      MAX(CASE WHEN pv.size = 'For Share' THEN pv.price END) AS for_share
    FROM cafe_inventory.products AS p
    INNER JOIN cafe_inventory.price_variants AS pv
      ON pv.product_id = p.id
    INNER JOIN cafe_inventory.product_categories AS pc
      ON pc.id = p.product_category_id    
    INNER JOIN cafe_inventory.status AS s
      ON s.code = p.status_code
    WHERE s.name = $1
    GROUP BY
      s.name,
      pc.name,
      p.id,
      p.product_code,
      p.name,
      p.product_category_id,
      p.description,
      p.photo_url
    ORDER BY p.id ASC;
  `,[status]);
  return rows;
};

export async function getFilteredProductsByCategory(category) {
  const { rows } = await pool.query(`
    SELECT 
      p.id AS id,
      p.product_code AS code,
      p.name AS name,
      s.name AS status_name,
      pc.name AS category,
      p.description AS description,
      p.photo_url AS image,
      MAX(CASE WHEN pv.size = 'Solo' THEN pv.price END) AS solo,
      MAX(CASE WHEN pv.size = 'Small' THEN pv.price END) AS small,
      MAX(CASE WHEN pv.size = 'Large' THEN pv.price END) AS large,
      MAX(CASE WHEN pv.size = 'For Share' THEN pv.price END) AS for_share
    FROM cafe_inventory.products AS p
    INNER JOIN cafe_inventory.price_variants AS pv
      ON pv.product_id = p.id
    INNER JOIN cafe_inventory.product_categories AS pc
      ON pc.id = p.product_category_id    
    INNER JOIN cafe_inventory.status AS s
      ON s.code = p.status_code
    WHERE pc.name = $1
    GROUP BY
      s.name,
      pc.name,
      p.id,
      p.product_code,
      p.name,
      p.product_category_id,
      p.description,
      p.photo_url
    ORDER BY p.id ASC;
  `,[category]);
  return rows;
};

export async function filterProductList(selectedSort, searchPattern) {
  let products = [];
  switch (selectedSort) {
    case 'Product Code':
      products = await getFilteredProductsByProductCode(searchPattern);
      return products; 
    case 'Product Name':
      products = await getFilteredProductsByName(searchPattern);
      return products;
    case 'Status':
      products = await getFilteredProductsByStatus(searchPattern);
      return products;
    case 'Category':
      products = await getFilteredProductsByCategory(searchPattern);
      return products;
    default:
      throw new Error(`Invalid sort option: ${selectedSort}`);
  }
};

export async function getStatusCode(status){
  const { rows } = await pool.query(`
    SELECT code FROM cafe_inventory.status AS s
    WHERE s.name = $1;`,[status]);
    return rows;
}

export async function getCategoryId(category){
  const { rows } = await pool.query(`
    SELECT id FROM cafe_inventory.product_categories AS pc
    WHERE pc.name = $1;`,[category]);
    return rows;
}

export async function updateProduct(code, name, statusId, categoryId, description, photoURL, id) {
  await pool.query(`UPDATE cafe_inventory.products SET product_code = $1,  name = $2, status_code = $3, product_category_id = $4, description = $5, photo_url = $6 WHERE id = $7;`, [code, name, statusId, categoryId, description, photoURL, id]);  
}

export async function updateProductPrice(product_id, size, price) {
  await pool.query(`UPDATE cafe_inventory.price_variants SET price = $3 WHERE product_id = $1 AND size = $2;`,[product_id, size, price]);
}