import { getMenuFilter, userLinks } from "../constants/constants.js";

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

    const menuFilter = filter.map((entry)=> {
        const href = entry.trim().replace(/\s+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toLowerCase());
        return {href: href, text: entry};
    })

    res.render("loggedUserMenu", {
        title: "Kape at Kain Menu",
        links: userLinks,
        filter: menuFilter,
        data: []
    })
}