import { check, validationResult } from "express-validator";
import { notAuthenticatedLinks, authenticatedLinks } from "../constants/constants.js";
import * as db from "../db/queries.js";
import bcrypt from "bcryptjs";

export async function homePage(req,res){
    const messages = await db.retrieveAllMessage();

    res.render("index", {
        title: "Home Page",
        user: req.user,
        notAuthenticatedLinks,
        authenticatedLinks,
        messages: messages,
        access: req.isAuthenticated()
    });
};

const registerValidation =[
    check('register-email')
        .isEmail().withMessage('Please provide a valid email address!').bail()
        .normalizeEmail(),
    check('register-username')
        .trim()
        .optional({ checkFalsy: true })
        .isLength({min: 5, max: 35}).withMessage('Username must be atleast 5 characters and at max 35 characters!')
        .isAlphanumeric().withMessage('Username must contain alphanumeric characters only!'),
    check('register-first-name')
        .trim()
        .notEmpty().withMessage('First Name is required!').bail()
        .isAlpha().withMessage('First Name must contain alphabetic characters only!'),
    check('register-last-name')
        .trim()
        .notEmpty().withMessage('Last Name is required!').bail()
        .matches(/^[a-zA-Z0-9.]+$/).withMessage('Last Name can only contain letters, numbers, and dots'),
    check('register-password')
        .notEmpty().withMessage('Please provide a password!').bail()
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
            minNumbers: 1,
        }).withMessage('Password must be at least 8 characters and include uppercase, lowercase, and a symbol'),
    check('register-confirm-password')
        .notEmpty().withMessage('Please confirm password!').bail()
        .custom((value, { req }) => { //access req
            if (value !== req.body['register-password']) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
]

export async function registerForm(req,res){
    res.render("register", {
        title: "Register Page",
        notAuthenticatedLinks,
        authenticatedLinks,
    });
};

export const registerFormPost = [
    registerValidation, async (req,res) =>{
        const errors = validationResult(req);
        const { 'register-username': username, 'register-password': password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        if (!errors.isEmpty()) {
            res.render("register", {
                title: "Register Page",
                notAuthenticatedLinks,
                authenticatedLinks,
                errors: errors.array()
            });
        }
        
        await db.createUser(username, hashedPassword);
        res.redirect("/");
    }
];

export async function loginFormGet(req,res){
    const flashErrors = req.flash("error"); // array of error strings

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