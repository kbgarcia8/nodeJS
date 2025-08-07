import { body, header, query, validationResult } from "express-validator";
import * as db from "../db/queries.js";
import { memberAuthenticatedLinks, guestAuthenticatedLinks, adminAuthenticatedLinks } from "../constants/constants.js";
import { ExpressValError } from "../utils/errors.js";
import { isSameDay } from "../utils/utility.js";

export async function messagesHomeGet (req, res) {
  const loggedUserMessages = await db.retrieveMessagesBelongToUser(req.user.id);

  const messages = loggedUserMessages.map((message) => ({
      ...message,
      editable: isSameDay(message.created_at_utc)
  }));

  return res.render("messages", {
    title: "My Messages",
    header: `${req.user.username}'s Messages 🗃`,
    memberAuthenticatedLinks,
    guestAuthenticatedLinks,
    adminAuthenticatedLinks,
    user: req.user,
    messages: messages
  });
};

export async function newMessageGet (req,res) {
  const loggedUser = req.user;

  return res.render("newMessage", {
    title: "New Message",
    header: "Post a new message 📩",
    user: req.user,
    memberAuthenticatedLinks,
    guestAuthenticatedLinks,
    adminAuthenticatedLinks
  });
}

const validateNewMessage = [
  body('newMessageTitle')
    .notEmpty().withMessage("Message Title is required!").bail()
    .trim()
    .isLength({min: 10, max:70}).withMessage("Message Title should be at least 10 characters and at max 70 characters"),
  body("newMessageText")
    .notEmpty().withMessage("Message Text is required!").bail()
    .trim()
    .isLength({ min: 50, max: 500 }).withMessage(`Message must be at least 50 characters and 500 characters at max`),
];

export const newMessagePost = [
  validateNewMessage,
  async (req, res) => {

    const errors = validationResult(req);
    const user = req.user;

    if (!errors.isEmpty()) {
      return res.render("newMessage", {
        title: "New Message",
        header: "Post a new message 📩",
        memberAuthenticatedLinks,
        guestAuthenticatedLinks,
        adminAuthenticatedLinks,
        user,
        errors: errors.array(),
      });
    }
    const {newMessageTitle, newMessageText } = req.body;

    await db.insertNewMessage(user.id, newMessageTitle, newMessageText);

    res.redirect("/messages");
  }
];

export const messageSearch = async (req, res) => {
  const retrievedMessages = await db.retrieveAllMessages();

  const messages = retrievedMessages.map((message) => ({
      ...message,
      editable: isSameDay(message.created_at_utc)
  }));

  return res.render("searchMessage", {
    title: "Search Message",
    messages,
    user: req.user,
    memberAuthenticatedLinks,
    guestAuthenticatedLinks,
    adminAuthenticatedLinks
  });
};

const validateMessageSearch = [
  // Just basic optional + trimming, no cross-field logic here
  query("searchMessagePattern").optional({ checkFalsy: true }).trim(),
  query("searchSenderPattern").optional({ checkFalsy: true }).trim(),
  query("searchTitlePattern").optional({ checkFalsy: true }).trim(),

  // Cross-field logic in a separate middleware
  (req, res, next) => {
    const { searchMessagePattern = "", searchSenderPattern = "", searchTitlePattern = "" } = req.query;

    if (!searchMessagePattern && !searchSenderPattern && !searchTitlePattern) {
      return next(new ExpressValError(
        "At least one of searchMessagePattern or searchSenderPattern must be provided.",
        400,
        "EXPRESS_VAL_ERROR_SEARCH_MESSAGE",
        {
          detail: "Provide either a message pattern or sender pattern to search.",
        }
      ));
    }

    next();
  },
];

export const messageSearchGet = [
  validateMessageSearch,
  async (req, res) => {
    const errors = validationResult(req);

    const messages = await db.retrieveAllMessages();

    const messages1 = messages.map((message) => ({
      ...message,
      editable: isSameDay(message.created_at_utc)
    }));

    const {searchMessagePattern, searchSenderPattern, searchTitlePattern} = req.query

    if (!errors.isEmpty()) {
      return res.status(400).render("searchedMessage", {
        title: "Search Message",
        messages1,
        user: req.user,
        memberAuthenticatedLinks,
        guestAuthenticatedLinks,
        adminAuthenticatedLinks,
        errors: errors.array(),
      });
    }

    const matchedMessages = await db.retrieveMatchMessages(searchMessagePattern, searchSenderPattern, searchTitlePattern);

    const messages2 = matchedMessages.map((message) => ({
      ...message,
      editable: isSameDay(message.created_at_utc)
    }));
    
    return res.render("searchedMessage", {
      title: "Searched Messages",
      messages: messages2,
      user: req.user,
      memberAuthenticatedLinks,
      guestAuthenticatedLinks,
      adminAuthenticatedLinks,
    });
  }
];

export const messageDeletePost = async (req, res) => {
  await db.deleteMessage(req.params.id);
  res.redirect("/dashboard");
};

export const messageEditGet = async (req, res) => {
  const message = await db.retrieveMessageById(req.params.id);

  res.render("editMessage", {
    title: "Edit Message",
    user: req.user,
    memberAuthenticatedLinks,
    guestAuthenticatedLinks,
    adminAuthenticatedLinks,
    header: `Message ID: ${req.params.id}`,
    message: message,
  });
};

const validateEditMessage = [
  body('editMessageTitle')
    .notEmpty().withMessage("Message Title is required!").bail()
    .trim()
    .isLength({min: 10, max:70}).withMessage("Message Title should be at least 10 characters and at max 70 characters"),
  body("editMessageText")
    .notEmpty().withMessage("Message Text is required!").bail()
    .trim()
    .isLength({ min: 50, max: 500 }).withMessage(`Message must be at least 50 characters and 500 characters at max`),
];

export const editMessagePost = [
  validateEditMessage,
  async (req, res) => {

    const errors = validationResult(req);
    const user = req.user;
    const message = await db.retrieveMessageById(req.params.id);

    if (!errors.isEmpty()) {
      return res.render("editMessage", {
        title: "Edit Message",
        user: req.user,
        memberAuthenticatedLinks,
        guestAuthenticatedLinks,
        adminAuthenticatedLinks,
        header: `Message ID: ${req.params.id}`,
        message: message,
        errors: errors.array(),
      });
    }
    const {editMessageTitle, editMessageText } = req.body;

    await db.updateMessage(req.params.id, editMessageTitle, editMessageText);

    res.redirect("/messages");
  }
]