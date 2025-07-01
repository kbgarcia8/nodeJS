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
}

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
}

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
}

export async function editProductGet(req,res){
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
}

export async function editProductPost(req,res){

}