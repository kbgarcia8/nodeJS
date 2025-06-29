import { userLinks } from "../constants/constants.js";
import * as db from "../db/queries.js"

export async function loggedUserHome (req,res){

    res.render("loggedUserHome", {
        title: "User Home",
        header: "Welcome to Kain at Kape user",
        links: userLinks,
        data: []
    })
};