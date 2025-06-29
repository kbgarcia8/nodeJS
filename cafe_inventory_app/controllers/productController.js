//This is for manipulation of product and is for admin only
import { body, query, validationResult } from "express-validator";
import { userLinks } from "../constants/constants.js";
import * as db from "../db/queries.js";

export async function listAllProuducts(req,res) {
    const products = await db.getAllProducts();

    const sorter = ['Product Code', 'Product Name', 'Status', 'Category']

    res.render("productList", {
        title: "Kape at Kain Products",
        links: userLinks,
        header: "Product List",
        sorter: sorter,
        selectedSorter: "All",
        searcher: [],
        searchPattern: '',
        data: products
    });
}

export async function listSortedByProuducts(req,res) {
    const products = await db.getAllProducts();

    const sorter = ['Product Code', 'Product Name', 'Status', 'Category'];
    let searcher = [];

    const selectedSort = req.body.sorter;
    const searchPattern = req.body.searcher;

    if (selectedSort === "All") {
        res.redirect("/products");
    } else {
        if(selectedSort === "Category") {
            const categories = await db.getCategories();
            searcher = categories.map((category) => category.name);
        } //CONTINUE HERE
        //const products = await db.filterProductList(selectedSort);
        res.render("selectedSort", {
            title: "Kape at Kain Products",
            links: userLinks,
            header: "Product List",
            sorter: sorter,
            selectedSorter: selectedSort,
            searcher: searcher,
            searchPattern: searchPattern,
            data: products
        });
    }
}