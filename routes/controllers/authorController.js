// controllers/authorController.js

import db from "../db.js";

async function getAuthorById(req, res) {
  const { authorId } = req.params;

  const author = await db.getAuthorById(Number(authorId));

  if (!author) {
    res.status(404).send("Author not found");
    return;
  }

  res.send(`Author Name: ${author.name}`);
};

export default getAuthorById;
/*
getAuthorById function is a controller that handles a specific action related to retrieving an author by their ID
*/
