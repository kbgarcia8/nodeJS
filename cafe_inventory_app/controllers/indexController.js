import { mainLinks } from "../constants/constants.js";

export async function tempHomePage (req,res){

    res.render("index", {
        title: "Kape at Kain",
        links: mainLinks,
        data: []
    })
}