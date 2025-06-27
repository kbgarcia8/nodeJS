import { getMenuFilter, userLinks } from "../constants/constants.js";
import * as db from "../db/queries.js"

export async function loggedUserHome (req,res){

    res.render("loggedUserHome", {
        title: "User Home",
        header: "Welcome to Kain at Kape user",
        links: userLinks,
        data: []
    })
}

export async function getAllMenu (req,res){
    const filter = await getMenuFilter();

    const menuFilter = filter.map((entry, index)=> {
        const href = entry.trim().replace(/\s+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toLowerCase());
        return {href: href, text: entry, index: index};
    })

    const products = await db.getAllProducts();

    console.dir(products)

    res.render("loggedUserMenu", {
        title: "Kape at Kain Menu",
        links: userLinks,
        filter: menuFilter,
        data: []
    })
}