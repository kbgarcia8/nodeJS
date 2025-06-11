import { body, query, validationResult } from "express-validator";
import * as db from "../db/queries.js"
import { links } from "../constants/constants.js";

export async function getAllMessages (req, res){
    const data = await db.getAllData();
    console.log("Data: ", data);
    res.render("index", {
        title: "Message Board",
        links: links,
        data: data
    })
   //res.send(data);

}