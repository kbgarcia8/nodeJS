import { getMenuFilter, userLinks } from "../constants/constants.js";
import * as db from "../db/queries.js";

export async function getAllMenu (req,res){
    const filter = await getMenuFilter();

    const menuFilter = filter.map((entry, index)=> {
        //const href = entry.trim().replace(/\s+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toLowerCase());
        return {href: entry, text: entry};
    })

    const products = await db.getAllProducts();

    let sortedProducts = {};

    for(let i=1; i<=menuFilter.length; i++){
        sortedProducts[i] = [];
    }

    products.map((product) => {
        sortedProducts[product.category].push(product);
    })

    res.render("allMenu", {
        title: "Kape at Kain Menu",
        links: userLinks,
        filter: menuFilter,
        data: sortedProducts
    });
}

export async function getFilteredMenu (req,res){
    const currentFilter = req.params.category;
    const filter = await getMenuFilter();

    const menuFilter = filter.map((entry, index)=> {        
        return {href: entry, text: entry};
    })

    const filteredProducts = await db.getFilteredProducts(currentFilter);

    res.render("filteredMenu", {
        title: `Kape at Kain ${currentFilter}`,
        links: userLinks,
        filter: menuFilter,
        header: currentFilter,
        products: filteredProducts
    })
}