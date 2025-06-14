import { body, query, validationResult } from "express-validator";
//'body' is for POST method and 'query' is for GET method validation
import * as db from "../db/queries.js";
import { links } from "../constants/constants.js";

const inputs = [
  {
    name: "messageUser",
    label: "User: ",
    type: "text"
  },
  {
    name: "messageUserEmail",
    label: "Email: ",
    type: "text"
  },
  {
    name: "messageText",
    label: "Message: ",
    type: "textarea"
  }
]

export const newMessageGet = (req, res) => {
  res.render("newMessage", {
    title: "New Message",
    header: "Send a Message",
    links: links,
    inputs: inputs
  });
};

const messageErr = "can only be up to 300 characters."

const validateNewMessage = [
  body("messageUser").optional({checkFalsy: true}).trim(),
  body("messageUserEmail").optional({checkFalsy: true}).isEmail().withMessage("Valid email is required"),
  body("messageText").trim().isLength({ min: 1, max: 300 }).withMessage(`Message ${messageErr}`),
]

export const newMessagePost = [
  validateNewMessage,
  async (req, res) => {
    
    let customError = [];
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("newMessage", {
        title: "New Message",
        header: "Send a Message",
        links: links,
        inputs: inputs,
        errors: errors.array(),
      });
    }
    const { messageUser, messageUserEmail, messageText } = req.body;
console.log(messageUser, messageUserEmail, messageText);
    if ((!messageUser && !messageUserEmail) || !messageText) {
      return res.status(400).json({ message: 'User or email and message are required' });
    }

    const user = await db.searchUsernames(messageUser, messageUserEmail);
    console.log(user[0]);

    if(user.length == 0) {
      customError = [{ msg: "User or email does not exist. Please create user first before sending a message" }];
      return res.status(400).render("newMessage", {
        title: "New Message",
        header: "Send a Message",
        links: links,
        inputs: inputs,
        errors: customError,
      });
    } else if (user.length>1) {
      customError = [{ msg: "More than 1 user or email was matched. Please specify a more unique pattern" }]
      return res.status(400).render("newMessage", {
        title: "New Message",
        header: "Send a Message",
        links: links,
        inputs: inputs,
        errors: customError,
      });
    }

    await db.insertMessage(user[0].id, messageText);

    res.redirect("/");
  }
]