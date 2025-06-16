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
const emailErr = "Valid and full email details is required before sending a message or provide username and email instead"
const validateNewMessage = [
  body("messageUser").optional({checkFalsy: true}).trim(),
  body("messageUserEmail").optional({checkFalsy: true}).isEmail().withMessage(emailErr),
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
    if ((!messageUser && !messageUserEmail) || !messageText) {
      customError = [{ msg: "User or email and message are required!"}];
      return res.status(400).render("newMessage", {
        title: "New Message",
        header: "Send a Message",
        links: links,
        inputs: inputs,
        errors: customError
      });
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

export const messageSearch = async (req, res) => {
  let disabled = false;
  let customError = [];
  const messages = await db.getAllMessages();
  

  if(messages.length === 0) {
    disabled = true
    customError = [{ msg: "There are no message saved in the database to search for." }]
  }

  res.render("searchMessage", {
    title: "Search Message",
    isDisabled: disabled,
    errors: customError
  });
};

const validateMessageSearch = [
  query("searchPattern").optional({checkFalsy: true}).trim(),
  query("searchSender").optional({checkFalsy: true}).trim(),
];

export const messageSearchGet = [
  validateMessageSearch,
  async (req, res) => {
    const errors = validationResult(req);
    let customError = [];

    const {searchPattern, searchSender} = req.query

    if (!errors.isEmpty()) {
      return res.status(400).render("searchMessage", {
        title: "Search Message",
        isDisabled: disabled,
        errors: errors.array(),
      });
    }

    if(!searchPattern && !searchSender) {
      customError = [{ msg: "Please provide at least one search of the search patterns." }]
      return res.status(400).render("searchMessage", {
        title: "Search Message",
        isDisabled: disabled,
        isDisabled: false
      });
    }

    const matchedMessages = await db.searchMessages(searchPattern, searchSender);

    if(matchedMessages==[]) {
      customError = [{ msg: "No user or message match." }]
      return res.status(400).render("searchMessage", {
        title: "Search Message",
        isDisabled: disabled,
        isDisabled: false
      });
    }
    
    res.render("searchedMessage", {
      title: "Searched Messages",
      matches: matchedMessages
    });
  }
]

export const messageDeletePost = async (req, res) => {
  await db.deleteMessage(req.params.id);
  res.redirect("/");
};

export const messageView = async (req, res) => {
  let customError = [];
  const message = await db.viewMessage(req.params.id);

  res.render("viewMessage", {
    title: "View Message",
    header: `Message ID: ${req.params.id}`,
    message: message,
    errors: customError
  });
};