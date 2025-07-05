import { links } from "../constants/constans.js";
import * as db from "../db/queries.js"

export async function indexPage(req,res){
    res.render("index", {
        title: "Home Page",
        links: links
    });
};

export async function signUpForm(req,res){
    res.render("signUp", {
        title: "Sign Up Page",
        links: links
    });
}

export async function signUpFormPost(req,res){
    const { username, password } = req.body;

    await db.createUser(username, password);
    res.redirect("/");
}