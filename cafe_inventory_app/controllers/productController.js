//This is for manipulation of product and is for admin only
import { body, query, validationResult } from "express-validator";
import { userLinks } from "../constants/constants.js";
import * as db from "../db/queries.js";

export async function listAllProducts(req,res) {
    const products = await db.getAllProducts();

    const sorter = ['Product Code', 'Product Name', 'Status', 'Category'];

    res.render("productList", {
        title: "Kape at Kain Products",
        links: userLinks,
        header: "Product List",
        sorter: sorter,
        selectedSorter: "All",
        searcher: [], //searcher is blank since All is selected by default
        searchPattern: '',
        products: products
    });
};

export async function chooseSortOption(req,res) {
    const products = await db.getAllProducts();

    const sorter = ['Product Code', 'Product Name', 'Status', 'Category'];
    let searcher = [];

    const selectedSort = req.body.sorter;
    const searchPattern = req.body.searcher;

    if (selectedSort === "All") {
        res.redirect("/products");
    } else {
        //searcher dropdown options depends on selected sort option
        if(selectedSort === "Product Code") {
            searcher = products.map((product) => product.code);
        } else if(selectedSort === "Product Name") {
            searcher = products.map((product) => product.name);
        } else if(selectedSort === "Status") {
            const status = await db.getProductStatus();
            searcher = status.map((stat)=> stat.name);
        } else if(selectedSort === "Category") {
            const categories = await db.getCategories();
            searcher = categories.map((category) => category.name);
        } else {
            searcher = [];
        }
        //const products = await db.filterProductList(selectedSort);
        res.render("selectedSort", {
            title: "Kape at Kain Products",
            links: userLinks,
            header: "Product List",
            sorter: sorter,
            selectedSorter: selectedSort,
            searcher: searcher,
            searchPattern: searchPattern,
            products: products
        });
    }
};

export async function searchedProducts(req,res) {
    const products = await db.getAllProducts();
    const sorter = ['Product Code', 'Product Name', 'Status', 'Category'];
    let searcher = [];

    const selectedSort = req.query.sorter;
    const searchPattern = req.query.searcher;

    const searchResult = await db.filterProductList(selectedSort, searchPattern);

    if (selectedSort === "All") {
        res.redirect("/products");
    } else {
        //searcher dropdown options depends on selected sort option
        if(selectedSort === "Product Code") {
            searcher = products.map((product) => product.code);
        } else if(selectedSort === "Product Name") {
            searcher = products.map((product) => product.name);
        } else if(selectedSort === "Status") {
            const status = await db.getProductStatus();
            searcher = status.map((stat)=> stat.name);
        } else if(selectedSort === "Category") {
            const categories = await db.getCategories();
            searcher = categories.map((category) => category.name);
        } else {
            searcher = [];
        }

        res.render("sortedProductList", {
            title: "Kape at Kain Products",
            links: userLinks,
            header: `Product List sorted by ${selectedSort}`,
            sorter: sorter,
            selectedSorter: selectedSort,
            searcher: searcher,
            searchPattern: searchPattern,
            searchResult: searchResult
        });
    }
};

export async function editProduct(req,res){
    const productId = req.params.id;

    const product = await db.getFilteredProductsById(productId);
    const status = await db.getProductStatus();
    const categories = await db.getCategories();

    res.render("editProduct", {
        title: "Edit Product",
        header: `Edit Product ID No. ${productId}`,
        product: product,
        status: status,
        categories: categories
    });
};

export const validateProductInfo = [
  body("productCode")
    .exists({ checkFalsy: true })
    .withMessage("Product Code is required")
    .bail()
    .trim()
    .matches(/^[A-Z0-9-]+$/)
    .withMessage("Product Update Error: Product Code must only consist of capital letters, numbers, and '-' symbol."),
  
  body("productName")
    .exists({ checkFalsy: true })
    .withMessage("Product Name is required")
    .bail()
    .trim()
    .matches(/^[A-Za-z\s\-']+$/)
    .withMessage("Product Update Error: Product Name must only consist of alphabets, space, apostrophes, or hyphens."),

  body("productDescription")
    .exists({ checkFalsy: true })
    .withMessage("Product Description is required")
    .bail()
    .isLength({ min: 50, max: 1000 })
    .withMessage("Product Description must be at least 50 characters and at most 300 characters."),

  body("productImage")
    .exists({ checkFalsy: true })
    .withMessage("Product Image URL is required")
    .bail()
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage("Product Update Error: Product Image must be a valid URL."),

  // Conditional Price Validation
  body("productSmallPrice")
    .custom((value, { req }) => {
      const category = req.body.productCategory;
      if (category === 'Iced Drink' || category === 'Hot Drink') {
        if (value === undefined || value === "") {
          throw new Error("Small price is required for drink products");
        }
        if (isNaN(value) || Number(value) < 1) {
          throw new Error("Small price must be a number and at least 1");
        }
      }
      return true;
    }),

  body("productLargePrice")
    .custom((value, { req }) => {
      const category = req.body.productCategory;
      if (category === 'Iced Drink' || category === 'Hot Drink') {
        if (value === undefined || value === "") {
          throw new Error("Large price is required for drink products");
        }
        if (isNaN(value) || Number(value) < 1) {
          throw new Error("Large price must be a number and at least 1");
        }
      }
      return true;
    }),

  body("productSoloPrice")
    .custom((value, { req }) => {
      const category = req.body.productCategory;
      if (category !== 'Iced Drink' && category !== 'Hot Drink') {
        if (value === undefined || value === "") {
          throw new Error("Solo price is required for meal products");
        }
        if (isNaN(value) || Number(value) < 1) {
          throw new Error("Solo price must be a number and at least 1");
        }
      }
      return true;
    }),

  body("productForSharePrice")
    .custom((value, { req }) => {
      const category = req.body.productCategory;
      if (category !== 'Iced Drink' && category !== 'Hot Drink') {
        if (value === undefined || value === "") {
          throw new Error("For Share price is required for meal products");
        }
        if (isNaN(value) || Number(value) < 1) {
          throw new Error("For Share price must be a number and at least 1");
        }
      }
      return true;
    }),
];

export const updateProduct = [
    validateProductInfo,
    async (req,res) => {
        const errors = validationResult(req);

        const productId = req.params.id;

        const product = await db.getFilteredProductsById(productId);
        const status = await db.getProductStatus();
        const categories = await db.getCategories();

        if(!errors.isEmpty()) {
            return res.status(400).render("editProduct", {
                title: "Edit Product",
                header: `Edit Product ID No. ${productId}`,
                product: product,
                status: status,
                categories: categories,
                errors: errors.array(),
            });
        }
        //extract submitted info
        const { productCode, productName, productStatus, productCategory, productSmallPrice, productSoloPrice, productLargePrice, productForSharePrice, productDescription, productImage } = req.body;
        //product informations
        if(productCode !== product[0].code || productName !== product[0].name || productStatus !== product[0].status_name || productCategory !== product[0].category || productDescription !== product[0].description || productImage !== product[0].image) {
            const status_code = await db.getStatusCode(productStatus);
            const category_id = await db.getCategoryId(productCategory);
            await db.updateProduct(productCode, productName, status_code[0].code, category_id[0].id, productDescription, productImage,productId);
        }
        //product prices
        if(product[0].small !== null && Number(productSmallPrice) !== Number(product[0].small)) {
            await db.updateProductPrice(productId, 'Small', productSmallPrice);
        } else if(product[0].solo !== null && Number(productSoloPrice) !== Number(product[0].solo)) {
            await db.updateProductPrice(productId, 'Solo', productSoloPrice);
        }

        if(product[0].large !== null && Number(productLargePrice) !== Number(product[0].large)) {
            await db.updateProductPrice(productId, 'Large', productLargePrice);
        } else if(product[0].for_share !== null && Number(productForSharePrice) !== Number(product[0].for_share)) {
            await db.updateProductPrice(productId, 'For Share', productForSharePrice);
        }
        
        return res.redirect("/products");
    }
];

export async function addProductGet(req,res) {

    const status = await db.getProductStatus();
    const categories = await db.getCategories();

    res.render("addProduct", {
        title: "Kape at Kain Add Product",
        links: userLinks,
        header: "Add Product",
        status: status,
        categories: categories,
        formData: req.body
    });
};

export const addProductPost=[
    validateProductInfo,
    async (req,res) => {        
        try {
            const errors = validationResult(req);

            const status = await db.getProductStatus();
            const categories = await db.getCategories();
            
            if(!errors.isEmpty()) {
                return res.render("addProduct", {
                    title: "Kape at Kain Add Product",
                    links: userLinks,
                    header: "Add Product",
                    status: status,
                    categories: categories,
                    errors: errors.array(),
                    formData: req.body
                });
            }
            //extract submitted info
            const { productCode, productName, productStatus, productCategory, productSmallPrice, productSoloPrice, productLargePrice, productForSharePrice, productDescription, productImage } = req.body;

            //add product information at products table
            const statusCode = await db.getStatusCode(productStatus);
            const categoryId = await db.getCategoryId(productCategory);

            console.log("Status code:", statusCode[0].code);
            console.log("Category ID:", categoryId[0].id);
            await db.addProductToProductsTable(productCode, productName, statusCode[0].code, categoryId[0].id, productDescription, productImage);
            //get created product id then add prices at product_variants table
            const newProductId = await db.getProductId(productName);
            if(productSmallPrice !== undefined && productLargePrice !== "") {
                await db.addPriceToProduct(newProductId[0].id, 'Small', productSmallPrice);
                await db.addPriceToProduct(newProductId[0].id, 'Large', productLargePrice);
            } else if(productSoloPrice !== undefined && productForSharePrice !== "") {
                await db.addPriceToProduct(newProductId[0].id, 'Solo', productSoloPrice);
               await db.addPriceToProduct(newProductId[0].id, 'For Share', productForSharePrice);
            }
            console.log(productCode, productName, productStatus, productCategory, productSmallPrice, productSoloPrice, productLargePrice, productForSharePrice, productDescription, productImage);
            return res.redirect("/products");
        } catch (err) {
            console.error("Error adding product:", err);
            res.status(500).send("Internal Server Error");
        }
    }
];

export async function deleteProduct(req,res){
  const currentProduct = req.params.id;

  await db.deleteProductById(currentProduct);

  console.log(`Product ID No. ${currentProduct} has been successfully deleted.`);

  res.redirect("/products");
};