import { body, query, validationResult } from "express-validator";
import * as db from "../db/queries.js";
import { notAuthenticatedLinks, guestAuthenticatedLinks, memberAuthenticatedLinks, adminAuthenticatedLinks } from "../constants/constants.js";


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
    
    const users2 = matchedUsers.map((user) => ({
      ...user,
      isAdmin: user.membership === 1 ? true : false
    }));
    
    return res.render("searchedUser", {
      title: "Searched Users",
      users: users2,
      user: req.user,
      memberAuthenticatedLinks,
      guestAuthenticatedLinks,
      adminAuthenticatedLinks,
    });
  }
]


/*
export const usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
    links: links,
  });
};

const alphaErr = "must only be alphanumeric and and can include @, _, ., and - symbols.";
const lengthErr = "must be between 1 and 30 characters.";
const emailErr = "must be a valid email address.";

const validateUser = [
  body("username").trim()
    .matches(/^[A-Za-z0-9@_.-]+$/).withMessage(`Username ${alphaErr}`)
    .isLength({ min: 1, max: 30 }).withMessage(`First name ${lengthErr}`),
  body("userEmail").trim()
    .isEmail().withMessage(`Email ${emailErr}`)
];

// We can pass an entire array of middleware validations to our controller.
export const usersCreatePost = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const { username, userEmail } = req.body;
    await db.insertUser(username, userEmail);
    res.redirect("/");
  }
];

export const usersUpdateGet = async (req, res) => {
  //const user = usersStorage.getUser(req.params.id);
  const user = await db.searchUserToUpdate(req.params.id);
  res.render("updateUser", {
    title: "Update user",
    user: user,
  });
};

export const usersUpdatePost = [
  validateUser,
  async (req, res) => {
    const { id } = req.params
    const { username, userEmail } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: "Update user",
        user: user,
        errors: errors.array(),
      });
    }    
    await db.updateUser(username, userEmail, id)
    res.redirect("/");
  }
];

export const userDeletePost = async (req, res) => {
  await db.deleteUsername(req.params.id);
  res.redirect("/");
};
*/