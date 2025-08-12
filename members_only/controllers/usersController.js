import { body, check, query, validationResult } from "express-validator";
import * as db from "../db/queries.js";
import { guestAuthenticatedLinks, memberAuthenticatedLinks, adminAuthenticatedLinks } from "../constants/constants.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

export const usersList = async (req, res) => {
  const users = await db.retrieveAllUsers();

  const isAdmin = req.user.status_code === 1 ? true : false;

  return res.render("usersList", {
    title: "Search User",
    user: req.user,
    memberAuthenticatedLinks,
    guestAuthenticatedLinks,
    adminAuthenticatedLinks,
    isAdmin,
    users: users
  });
};

export const usersSearch = async (req, res) => {
  const users = await db.retrieveAllUsers();

  return res.render("searchUser", {
    title: "Search User",
    user: req.user,
    memberAuthenticatedLinks,
    guestAuthenticatedLinks,
    adminAuthenticatedLinks,
    users: users
  });
};

const validateUserSearch = [
  query("searchUsername").optional({checkFalsy: true}).trim(),
  query("searchFirstName").optional({checkFalsy: true}).trim(),
  query("searchLastName").optional({checkFalsy: true}).trim(),
  query("searchUserEmail").optional({checkFalsy: true}).isEmail().withMessage("Valid email is required"),
];

export const usersSearchGet = [
  validateUserSearch,
  async (req, res) => {
    const errors = validationResult(req);

    const {searchUsername, searchFirstName, searchLastName, searchUserEmail} = req.query
    const users = await db.retrieveAllUsers();

    if (!errors.isEmpty()) {
      return res.status(400).render("searchUser", {
        title: "Search User",
        user: req.user,
        memberAuthenticatedLinks,
        guestAuthenticatedLinks,
        adminAuthenticatedLinks,
        users: users,
        errors: errors.array(),
      });
    }

    const matchedUsers = await db.retrieveMatchUsers(searchUsername, searchFirstName, searchLastName, searchUserEmail);
    
    const isAdmin = req.user.membership === 1 ? true : false;
    
    return res.render("searchedUser", {
      title: "Searched Users",
      users: matchedUsers,
      user: req.user,
      memberAuthenticatedLinks,
      guestAuthenticatedLinks,
      adminAuthenticatedLinks,
      isAdmin
    });
  }
]

export const usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
    user: req.user,
    memberAuthenticatedLinks,
    guestAuthenticatedLinks,
    adminAuthenticatedLinks
  });
};

const createUserValidation = [
    check('createUserEmail')
        .isEmail().withMessage('Please provide a valid email address!').bail()
        .normalizeEmail(),
    check('createUserUsername')
        .trim()
        .optional({ checkFalsy: true })
        .isLength({min: 5, max: 35}).withMessage('Username must be atleast 5 characters and at max 35 characters!')
        .isAlphanumeric().withMessage('Username must contain alphanumeric characters only!'),
    check('createUserFirstName')
        .trim()
        .notEmpty().withMessage('First Name is required!').bail()
        .isAlpha().withMessage('First Name must contain alphabetic characters only!'),
    check('createUserLastName')
        .trim()
        .notEmpty().withMessage('Last Name is required!').bail()
        .matches(/^[a-zA-Z0-9.\-]+$/).withMessage('Last Name can only contain letters, numbers, hypen and dots'),
    check('createUserPassword')
        .notEmpty().withMessage('Please provide a password!').bail()
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
            minNumbers: 1,
        }).withMessage('Password must be at least 8 characters and include uppercase, lowercase, and a symbol'),
    check('createUserMembershipCode')
        .trim()
        .notEmpty()
];

export const usersCreatePost = [
    createUserValidation, asyncHandler(async (req,res) =>{
        const errors = validationResult(req);
        const { createUserEmail, createUserUsername, createUserFirstName, createUserLastName, createUserPassword, createUserMembershipCode } = req.body;
        const hashedPassword = await bcrypt.hash(createUserPassword, 10);
        console.log(req.body);
        if (!errors.isEmpty()) {
            return res.render("createUser", {
                title: "Create user",
                user: req.user,
                memberAuthenticatedLinks,
                guestAuthenticatedLinks,
                adminAuthenticatedLinks,
                errors: errors.array()
            });
        }
        if(createUserUsername !== "") {
            await db.createUser(createUserFirstName, createUserLastName, createUserUsername, createUserEmail, hashedPassword);
        } else {
            const extractedUsername = createUserEmail.split('@')[0];
            await db.createUser(createUserFirstName, createUserLastName, createUserUsername, createUserEmail, hashedPassword);
        }
        const createdUser = await db.retrieveNewlyCreatedUser(createUserEmail);
        
        await db.addMembershipToCreatedUser(createdUser.id, parseInt(createUserMembershipCode));
        
        res.redirect("/users");
    })
];


export const usersUpdateGet = async (req, res) => {
  //const user = usersStorage.getUser(req.params.id);
  const userInfo = await db.retrieveUserById(req.params.id);
 return res.render("updateUser", {
    title: "Update user",
    user: req.user,
    userInfo,
    memberAuthenticatedLinks,
    guestAuthenticatedLinks,
    adminAuthenticatedLinks,
  });
};

const updateUserValidation = [
    check('updateUserEmail')
        .isEmail().withMessage('Please provide a valid email address!').bail()
        .normalizeEmail(),
    check('updateUserUsername')
        .trim()
        .optional({ checkFalsy: true })
        .isLength({min: 5, max: 35}).withMessage('Username must be atleast 5 characters and at max 35 characters!')
        .isAlphanumeric().withMessage('Username must contain alphanumeric characters only!'),
    check('updateUserFirstName')
        .trim()
        .notEmpty().withMessage('First Name is required!').bail()
        .isAlpha().withMessage('First Name must contain alphabetic characters only!'),
    check('updateUserLastName')
        .trim()
        .notEmpty().withMessage('Last Name is required!').bail()
        .matches(/^[a-zA-Z0-9.\-]+$/).withMessage('Last Name can only contain letters, numbers, hypen and dots'),
    check('updateUserMembershipCode')
        .trim()
        .notEmpty()
];

export const usersUpdatePost = [
  updateUserValidation,
  asyncHandler(async (req,res) =>{
        const errors = validationResult(req);
        const { updateUserEmail, updateUserUsername, updateUserFirstName, updateUserLastName, updateUserMembershipCode } = req.body;
        
        
        if (!errors.isEmpty()) {
            return res.render("updateUser", {
                title: "Update user",
                user: req.user,
                userInfo,
                memberAuthenticatedLinks,
                guestAuthenticatedLinks,
                adminAuthenticatedLinks,
                errors: errors.array()
            });
        }
        const userId = req.params.id;

        if(updateUserUsername !== "") {
            await db.updateUser(userId, updateUserFirstName, updateUserLastName, updateUserUsername, updateUserEmail);
        } else {
            const extractedUsername = updateUserEmail.split('@')[0];
            await db.updateUser(userId, updateUserFirstName, updateUserLastName, updateUserUsername, updateUserEmail);
        }
        const updatedUser = await db.retrieveNewlyCreatedUser(updateUserEmail);
        
        await db.modifyMembership(userId, parseInt(updateUserMembershipCode));
        
        res.redirect("/users");
    })
];

export const userDelete = async (req, res) => {
  await db.deleteUser(req.params.id);
  res.redirect("/users");
};