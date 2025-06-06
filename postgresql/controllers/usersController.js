import { body, query, validationResult } from "express-validator";
//'body' is for POST method and 'query' is for GET method validation
import * as db from "../db/queries.js";

export async function getUsernames(req, res) {
  const usernames = await db.getAllUsernames();
  console.log("Usernames: ", usernames);
    res.render("index", {
      title: "Username Database",
      header: "All Users",
      users: usernames
    });
}

export async function createUsernameGet(req, res) {
  res.render("form", {  title: "New User", header: "Create a username"});
}

export async function createUsernamePost(req, res) {
  const { username } = req.body;
  await db.insertUsername(username);
  res.redirect("/");
}

export async function searchUserGet(req, res) {
  const { search } = req.query;
  const searchResult = await db.searchUsernames(search);
  
  res.render("index", {
      title: "Search Database",
      header: "Searched Users",
      users: searchResult
    });
}