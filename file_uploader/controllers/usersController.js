import { check, query, validationResult } from "express-validator";
import * as prisma from '../prisma/prisma.js';
import { guestAuthenticatedLinks, memberAuthenticatedLinks, adminAuthenticatedLinks } from "../constants/constants.js";
import { formatDateTime } from "../utils/utility.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

export const usersList = async (req, res) => {
  const usersRaw = await prisma.retrieveAllUsers();

  const users = usersRaw.map((user) => {
      return {
          ...user, 
          created_at: formatDateTime(user.created_at)
      }
  });

  const isAdmin = req.user.role === 'ADMIN' ? true : false;

  return res.render("usersList", {
    title: "Users",
    user: req.user,
    memberAuthenticatedLinks,
    guestAuthenticatedLinks,
    adminAuthenticatedLinks,
    isAdmin,
    users: users
  });
};
export const usersSearch = async (req, res) => {
  const usersRaw = await prisma.retrieveAllUsers();

  const users = usersRaw.map((user) => {
      return {
          ...user, 
          created_at: formatDateTime(user.created_at)
      }
  });

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
    const usersRaw = await prisma.retrieveAllUsers();

    const users = usersRaw.map((user) => {
      return {
          ...user, 
          created_at: formatDateTime(user.created_at)
      }
    });

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

    const matchedUsersRaw = await prisma.retrieveSearchedUsers(searchUsername, searchFirstName, searchLastName, searchUserEmail);

    const matchedUsers = matchedUsersRaw.map((user) => {
      return {
          ...user, 
          created_at: formatDateTime(user.created_at)
      }
    });
    
    const isAdmin = req.user.role === 'ADMIN' ? true : false;
    
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
];
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
    check('createUserMemberType')
        .trim()
        .notEmpty()
];
export const usersCreatePost = [
    createUserValidation, asyncHandler(async (req,res) =>{
        const errors = validationResult(req);
        const { createUserEmail, createUserUsername, createUserFirstName, createUserLastName, createUserPassword, createUserMemberType } = req.body;
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
            await prisma.createUser(createUserFirstName, createUserLastName, createUserUsername, createUserEmail, hashedPassword, createUserMemberType);
        } else {
            const extractedUsername = createUserEmail.split('@')[0];
            await prisma.createUser(createUserFirstName, createUserLastName, extractedUsername, createUserEmail, hashedPassword);
        }
        res.redirect("/users");
    })
];
export const usersUpdateGet = async (req, res) => {
  const userToUpdate = await prisma.retrieveUserById(parseInt(req.params.id));
  return res.render("updateUser", {
    title: "Update user",
    user: userToUpdate,
    memberAuthenticatedLinks,
    guestAuthenticatedLinks,
    adminAuthenticatedLinks,
  });
};
const updateUserValidation = [
    check('updateUserId')
        .notEmpty(),
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
    check('updateUserMemberType')
        .trim()
        .notEmpty()
];
export const usersUpdatePost = [
  updateUserValidation,
  asyncHandler(async (req,res) =>{
        const errors = validationResult(req);

        const { updateUserEmail, updateUserUsername, updateUserFirstName, updateUserLastName, updateUserMemberType } = req.body;
        
        
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
            await db.updateUser(userId, updateUserFirstName, updateUserLastName, updateUserUsername, updateUserEmail, updateUserMemberType);
        } else {
            const extractedUsername = updateUserEmail.split('@')[0];
            await db.updateUser(userId, updateUserFirstName, updateUserLastName, extractedUsername, updateUserEmail, updateUserMemberType);
        }
        
        res.redirect("/users");
  })
];
export const userDelete = async (req, res) => {
  await prisma.deleteUserById(parseInt(req.params.id));
  res.redirect("/users");
};
export const upgradeMembershipGet = async (req,res) => {
  return res.render("memberTypeUpgrade", {
    title: "Member Type Upgrade",
    header: "Guest to User",
    user: req.user,
    memberAuthenticatedLinks,
    guestAuthenticatedLinks,
    adminAuthenticatedLinks,
  });
};
const updateMemberTypeValidation = [
  check('memberSecretCode')
    .trim()
    .optional({ checkFalsy: true })
    .custom((value, { req }) => {
        if (value === 'f1L3upL0@d3r') {
            req.isValidMembershipCode = true; 
        } else {
            req.isValidMembershipCode = false;
        }
        return true; 
    })
]
export const upgradeMembershipPost = [
  updateMemberTypeValidation,
  asyncHandler(async (req,res) =>{
        const errors = validationResult(req);
        const currentUser = req.user;
        
        if (!errors.isEmpty()) {
            return res.render("memberTypeUpgrade", {
                title: "Member Type Upgrade",
                header: "Guest to User",
                user: req.user,
                memberAuthenticatedLinks,
                guestAuthenticatedLinks,
                adminAuthenticatedLinks,
                errors: errors.array()
            });
        }
        if(req.isValidMembershipCode === true){
          await prisma.changeMemberType(currentUser.id, 'USER');
        } else {
          return res.render("memberTypeUpgrade", {
              title: "Member Type Upgrade",
              header: "Guest to User",
              user: req.user,
              memberAuthenticatedLinks,
              guestAuthenticatedLinks,
              adminAuthenticatedLinks,
              errors: [{msg: "Incorrect membership code. Please provide correct member type upgrade code"}]
            });
        }
        res.redirect("/dashboard");
  })
];