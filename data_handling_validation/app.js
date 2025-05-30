import { body, validationResult } from "express-validator";

[
  body("birthdate", "Must be a valid date.")
    .optional({ values: "falsy" })
    .isISO8601() // Enforce a YYYY-MM-DD format.
];

[
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name can not be empty.")
    .isAlpha()
    .withMessage("Name must only contain alphabet letters."),  
];
