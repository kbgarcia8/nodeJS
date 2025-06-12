import { body, query, validationResult } from "express-validator";
//'body' is for POST method and 'query' is for GET method validation
import * as db from "../db/queries.js"
import { links } from "../constants/constants.js";

export const usersListGet = async (req, res) => {
  const users = await db.getAllUsernames();
  res.render("userList", {
    title: "User list",
    links: links,
    users: users,
  });
};

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

export const usersSearch = async (req, res) => {
  let disabled = false;
  let customError = [];
  const users = await db.getAllUsernames();
  

  if(users.length === 0) {
    disabled = true
    customError = [{ msg: "There are no users saved in the storage to search for." }]
  }

  res.render("searchUser", {
    title: "Search User",
    isDisabled: disabled,
    errors: customError
  });
};

const validateUserSearch = [
  query("searchUsername").optional({checkFalsy: true}).trim(),
  query("searchUserEmail").optional({checkFalsy: true}).isEmail().withMessage("Valid email is required"),
]

export const usersSearchGet = [
  validateUserSearch,
  async (req, res) => {
    const errors = validationResult(req);
    let customError = [];

    const {searchUsername, searchUserEmail} = req.query

    if (!errors.isEmpty()) {
      return res.status(400).render("searchUser", {
        title: "Search user",
        errors: errors.array(),
        isDisabled: false
      });
    }

    if(!searchUsername && !searchUserEmail) {
      customError = [{ msg: "Please provide at least one search field." }]
      return res.status(400).render("searchUser", {
        title: "Search user",
        errors: customError,
        isDisabled: false
      });
    }

    const matchedUsers = await db.searchUsernames(searchUsername, searchUserEmail);
    
    res.render("search", {
      title: "Search Results",
      matches: matchedUsers
    });
    //no need for redirect since it will clear the query
  }
]

/*
export const usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};

  */