// controllers/authorController.js

import getAuthorByIdinDB from "../db.js";
import expressAsyncHandler from "express-async-handler";
import CustomNotFoundError from "../errors/CustomNotFoundError.js";

const getAuthorById = expressAsyncHandler(async (req, res) => {
  const { authorId } = req.params;

  const author = await getAuthorByIdinDB(Number(authorId));

  if (!author) {
    throw new CustomNotFoundError("Author not found");
  }

  res.send(`Author Name: ${author.name}`);
});

export default getAuthorById;
/*
getAuthorById function is a controller that handles a specific action related to retrieving an author by their ID
*/
