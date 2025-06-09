import { body, query, validationResult } from "express-validator";
//'body' is for POST method and 'query' is for GET method validation

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
    const { firstName, lastName, userAge, userBio } = req.body;
    usersStorage.addUser({ firstName, lastName, userEmail, userAge, userBio });
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

export const usersSearch = (req, res) => {
  let disabled = false;
  let customError = [];

  if(usersStorage.getUsers().length === 0) {
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
  query("searchFirstName").optional({checkFalsy: true}).trim(),
  query("searchLastName").optional({checkFalsy: true}).trim(),
  query("searchUserEmail").optional({checkFalsy: true}).isEmail().withMessage("Valid email is required"),
]

export const usersSearchGet = [
  validateUserSearch,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("searchUser", {
        title: "Search user",
        errors: errors.array(),
        isDisabled: false
      });
    }
    let customError = [];
    let matchedUsers = [];
    const {searchFirstName, searchLastName, searchUserEmail} = req.query

    if(!searchFirstName && !searchLastName && !searchUserEmail) {
      customError = [{ msg: "Please provide at least one search field." }]
      return res.status(400).render("searchUser", {
        title: "Search user",
        errors: customError,
        isDisabled: false
      });
    } else {
      matchedUsers = usersStorage.storage.filter(user => {
      //to create dynamic regex based on variable value use new RegExp
      const firstNameMatch = searchFirstName ? new RegExp(searchFirstName, "i").test(user.firstName) : false;
      const lastNameMatch = searchLastName ? new RegExp(searchLastName, "i").test(user.lastName) : false;
      const emailMatch = searchUserEmail ? new RegExp(searchUserEmail, "i").test(user.userEmail) : false;

      return firstNameMatch || lastNameMatch || emailMatch;

      })
    }
    
    res.render("search", {
      title: "Search Results",
      matches: matchedUsers
    });
    //no need for redirect since it will clear the  query
  }
]