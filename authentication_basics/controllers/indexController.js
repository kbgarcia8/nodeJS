import { links } from "../constants/constans.js";
import * as db from "../db/queries.js";
import bcrypt from "bcryptjs";

export async function indexPage(req,res){
    res.render("index", {
        title: "Home Page",
        user: req.user,
        links: links
    });
};

export async function signUpForm(req,res){
    res.render("signUp", {
        title: "Sign Up Page",
        links: links
    });
};

export async function signUpFormPost(req,res){
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.createUser(username, hashedPassword);
    res.redirect("/");
};

export async function loginFormGet(req,res){
    const flashErrors = req.flash("error"); // array of error strings

    // Map strings to objects with a `.msg` key
    const errors = flashErrors.map(msg => ({ msg }));

    res.render("login", {
        title: "Login Page",
        links: links,
        user: req.user,
        errors: errors
    });
};

export async function logOut (req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}