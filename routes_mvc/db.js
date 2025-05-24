const authors = [
  { id: 1, name: "Bryan" },
  { id: 2, name: "Christian" },
  { id: 3, name: "Jason" },
];

async function getAuthorByIdinDB(authorId) {
  return authors.find(author => author.id === authorId);
};

export default getAuthorByIdinDB;