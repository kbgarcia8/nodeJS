import { body, query, validationResult } from "express-validator";
import * as db from "../db/queries.js";
import { memberAuthenticatedLinks, guestAuthenticatedLinks, adminAuthenticatedLinks } from "../constants/constants.js";

export async function messagesHome (req, res) {
  const loggedUserMessages = await db.retrieveMessagesBelongToUser(req.user.id);

  return res.render("messages", {
    title: "My Messages",
    header: `${req.user.username}'s Messages 🗃`,
    memberAuthenticatedLinks,
    guestAuthenticatedLinks,
    adminAuthenticatedLinks,
    user: req.user,
    messages: loggedUserMessages
  });
};

export async function newMessageGet (req,res) {
  const loggedUser = req.user;

  return res.render("newMessage", {
    title: "New Message",
    header: "Post a new message 📩",
    memberAuthenticatedLinks,
    guestAuthenticatedLinks,
    adminAuthenticatedLinks
  });
}


const validateNewMessage = [
  body('new-message-title')
    .notEmpty().withMessage("Message Title is required!").bail()
    .trim()
    .isLength({min: 10, max:70}).withMessage("Message Title should be at least 10 characters and at max 70 characters"),
  body("new-message")
    .notEmpty().withMessage("Message Text is required!").bail()
    .trim()
    .isLength({ min: 50, max: 500 }).withMessage(`Message must be at least 50 characters and 500 characters at max`),
]


export const newMessagePost = [
  validateNewMessage,
  async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("newMessage", {
        title: "New Message",
        header: "Post a new message 📩",
        memberAuthenticatedLinks,
        guestAuthenticatedLinks,
        adminAuthenticatedLinks,
        errors: errors.array(),
      });
    }
    const {'new-message-title': newMessageTitle, 'new-message': newMessageText } = req.body;

    const user = req.user;

    console.log(user);

    await db.insertNewMessage(user.id, newMessageTitle, newMessageText);

    res.redirect("/messages");
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
/*
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
*/