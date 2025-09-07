import { check, validationResult } from "express-validator";
import { notAuthenticatedLinks, memberAuthenticatedLinks } from "../constants/constants.js";
import { ExpressValError } from "../utils/errors.js";
import asyncHandler from "express-async-handler";
import * as prisma from "../prisma/prisma.js";
import bcrypt from "bcryptjs";
import passport from "passport";

export async function homePage(req,res){
    return res.render("index", {
        title: "Home Page",
        notAuthenticatedLinks
    });
};

const registerValidation =[
    check('registerEmail')
        .isEmail().withMessage('Please provide a valid email address!').bail()
        .normalizeEmail(),
    check('registerUsername')
        .trim()
        .optional({ checkFalsy: true })
        .isLength({min: 5, max: 35}).withMessage('Username must be atleast 5 characters and at max 35 characters!')
        .isAlphanumeric().withMessage('Username must contain alphanumeric characters only!'),
    check('registerFirstName')
        .trim()
        .notEmpty().withMessage('First Name is required!').bail()
        .isAlpha().withMessage('First Name must contain alphabetic characters only!'),
    check('registerLastName')
        .trim()
        .notEmpty().withMessage('Last Name is required!').bail()
        .matches(/^[a-zA-Z0-9.\-]+$/).withMessage('Last Name can only contain letters, numbers, hypen and dots'),
    check('registerPassword')
        .notEmpty().withMessage('Please provide a password!').bail()
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
            minNumbers: 1,
        }).withMessage('Password must be at least 8 characters and include uppercase, lowercase, and a symbol'),
    check('registerConfirmPassword')
        .notEmpty().withMessage('Please confirm password!').bail()
        .custom((value, { req }) => { //access req
            if (value !== req.body['registerPassword']) {
                throw new ExpressValError("Password do not match", 400, "EXPRESS_VAL_ERROR_REG_PASS_NOT_MATCH", {
                    detail: "Password during register does not match!",
                });
            }
            return true;
        })
];

export async function registerForm(req,res){
    return res.render("register", {
        title: "Register Page",
        notAuthenticatedLinks
    });
};

export const registerFormPost = [
    registerValidation, asyncHandler(async (req,res) =>{
        const errors = validationResult(req);
        const { registerFirstName, registerLastName, registerUsername, registerEmail, registerPassword } = req.body;
        const hashedPassword = await bcrypt.hash(registerPassword, 10);

        if (!errors.isEmpty()) {
            return res.render("register", {
                title: "Register Page",
                notAuthenticatedLinks,
                //memberAuthenticatedLinks,
                //guestAuthenticatedLinks,
                //adminAuthenticatedLinks,
                errors: errors.array()
            });
        }
        if(registerUsername !== "") {
            await prisma.createUser(registerFirstName, registerLastName, registerUsername, registerEmail, hashedPassword);
        } else {
            const extractedUsername = registerEmail.split('@')[0];
            await prisma.createUser(registerFirstName, registerUsername, extractedUsername, registerEmail, hashedPassword);
        }
        res.redirect("/");
    })
];

export async function loginFormGet(req,res){
    const flashErrors = req.flash("error"); // array of error strings

    const errors = flashErrors.map(msg => ({ msg }));

    return res.render("login", {
        title: "Login Page",
        notAuthenticatedLinks,
        errors: errors
    });
}; 

const loginValidation =[
    check('loginEmail')
        .isEmail().withMessage('Please provide a valid email address!').bail()
        .normalizeEmail(),
    check('loginPassword')
        .notEmpty().withMessage('Please provide a password!')
];

export const loginFormPost = [
    loginValidation, asyncHandler(async (req,res,next) =>{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("login", {
                title: "Login Page",
                notAuthenticatedLinks,
                //memberAuthenticatedLinks,
                //guestAuthenticatedLinks,
                //adminAuthenticatedLinks,
                errors: errors.array()
            });
        }
        //STILL need to call passport.authenticate after login
        //The error throwing and handling here are only available during login and not meant to be a middleware in protected routes
        passport.authenticate("local", (err, user, info) => { 
        //Below is the logic on how submitted info are processed are in passport.js
        if (err) return next(err);

        if (!user) {
            return res.render("login", {
                title: "Login Page",
                notAuthenticatedLinks,
                errors: [{ msg: info?.message || "Login failed" }]
            });
        }

        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect("/dashboard");
            //res.send("User login successful")
        });
        })(req, res, next);
    })
];

export async function dashboardGet(req,res){
    const publicFiles = [] //public files will be fetched later on

    return res.render("dashboard", {
        title: "Dashboard",
        header: `Hi ${req.user.username}, Welcome back!`,
        notAuthenticatedLinks,
        memberAuthenticatedLinks,
        //guestAuthenticatedLinks,
        //adminAuthenticatedLinks,
        files: publicFiles,
        user: req.user
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