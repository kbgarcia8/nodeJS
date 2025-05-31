import usersStorage from "../storages/usersStorage.js";

console.log(usersStorage)
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

export const usersCreatePost = (req, res) => {
  const { firstName, lastName } = req.body;
  usersStorage.addUser({ firstName, lastName });
  res.redirect("/");
};
