import usersStorage from "../storages/usersStorage.js";
import { body, validationResult } from "express-validator";

export const usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

export const usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const emailErr = "must be a valid email address.";
const ageErr = "must be a number between  18 and 120."
const bioErr = "has a maximum characters of 200."

const validateUser = [
  body("firstName").trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
  body("lastName").trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
  body("userEmail").trim()
    .isEmail().withMessage(`Email ${emailErr}`),
  body("userAge").optional()
    .trim().isNumeric().withMessage(`Age must be a number`)
    .isInt({min: 18, max: 120}).withMessage(`Age ${ageErr}`),
  body("userBio").optional()
    .trim().isLength({min: 0, max: 200}).withMessage(`Bio ${bioErr}`)
];

// We can pass an entire array of middleware validations to our controller.
export const usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const { firstName, lastName } = req.body;
    usersStorage.addUser({ firstName, lastName });
    res.redirect("/");
  }
];

export const usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  res.render("updateUser", {
    title: "Update user",
    user: user,
  });
};

export const usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: "Update user",
        user: user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName } = req.body;
    usersStorage.updateUser(req.params.id, { firstName, lastName });
    res.redirect("/");
  }
];

export const usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};