import { check, validationResult } from "express-validator";
import { notAuthenticatedLinks, memberAuthenticatedLinks } from "../constants/constants.js";
import asyncHandler from "express-async-handler";
import * as db from "../db/queries.js";
import bcrypt from "bcryptjs";
import passport from "passport";

export async function homePage(req,res){
    const messages = await db.retrieveAllMessages();
    

    const messagesOnly = messages.map((message) => {
        return message.message;
    })

    const recentMessages = messagesOnly.slice(-4);

    return res.render("index", {
        title: "Home Page",
        notAuthenticatedLinks,
        recentMessages
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
        }),
    check('register-membership-code')
        .trim()
        .optional({ checkFalsy: true })
        .custom((value, { req }) => {
            if (value === 'M3mbeRs0nLy4ev3r') {
                req.isValidMembershipCode = true; 
            } else {
                req.isValidMembershipCode = false;
            }
            return true; 
        })
]

export async function registerForm(req,res){
    return res.render("register", {
        title: "Register Page",
        notAuthenticatedLinks
    });
};

export const registerFormPost = [
    registerValidation, asyncHandler(async (req,res) =>{
        const errors = validationResult(req);
        const { 'register-first-name': firstName, 'register-last-name': lastName, 'register-username': username, 'register-email': email, 'register-password': password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        if (!errors.isEmpty()) {
            return res.render("register", {
                title: "Register Page",
                notAuthenticatedLinks,
                memberAuthenticatedLinks,
                errors: errors.array()
            });
        }
        if(username !== "") {
            await db.createUser(firstName, lastName, username, email, hashedPassword);
        } else {
            const extractedUsername = email.split('@')[0];
            await db.createUser(firstName, lastName, extractedUsername, email, hashedPassword);
        }
        const createdUser = await db.retrieveUserByEmail(email);
        //Because of checkFalsy = true it will skip if no code was provided and req.isValidMembershipCode will be undefined to must set to false if that is the case
        if (typeof req.isValidMembershipCode === 'undefined') {
            req.isValidMembershipCode = false;
        }
        console.log(req.isValidMembershipCode)
        await db.addDefaultMembership(createdUser.id, req.isValidMembershipCode)
        
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
    check('login-email')
        .isEmail().withMessage('Please provide a valid email address!').bail()
        .normalizeEmail(),
    check('login-password')
        .notEmpty().withMessage('Please provide a password!')
];

export const loginFormPost = [
    loginValidation, asyncHandler(async (req,res,next) =>{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("login", {
                title: "Login Page",
                notAuthenticatedLinks,
                memberAuthenticatedLinks,
                errors: errors.array()
            });
        }
        //STILL need to call passport.authenticate after login
        //The error throwing and handling here are only available during login and not meant to be a middleware in protected routes
        passport.authenticate("local", (err, user, info) => {
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
        });
        })(req, res, next);
    })
];

export async function dashboardGet(req,res){
    const messages = await db.retrieveAllMessages();

    return res.render("dashboard", {
        title: "Dashboard",
        header: `Hi ${req.user.username}, Welcome back!`,
        notAuthenticatedLinks,
        memberAuthenticatedLinks,
        messages: messages,
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