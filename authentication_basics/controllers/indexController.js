import { links } from "../constants/constans.js";

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