import { notAuthenticatedlinks } from "../constants/constants.js";
import * as db from "../db/queries.js";
import bcrypt from "bcryptjs";

export async function homePage(req,res){
    res.render("index", {
        title: "Home Page",
        user: req.user,
        links: notAuthenticatedlinks
    });
};

export async function registerForm(req,res){
    res.render("register", {
        title: "Register Page",
        links: notAuthenticatedlinks
    });
};

export async function registerFormPost(req,res){
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.createUser(username, hashedPassword);
    res.redirect("/");
};
/*
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
*/