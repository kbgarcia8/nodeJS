import { getCategories } from "../db/queries.js";


export const getMenuFilter = async() => {
    const data = await getCategories();
    const categories = data.map((entry) => entry.name);
    return categories;
}

export const mainLinks = [
  { href: "/", text: "Home" },
  { href: "/about", text: "About Us" },
  { href: "/testimonials", text: "Testimonials" },
  { href: "/user/home", text: "Login" }, //Temporary Login
];

export const userLinks = [
  { href: "/user/home", text: "Home" },
  { href: "/menu", text: "Menu" },
  { href: "/products", text: "Products (Admin Only)" },
  { href: "/products/add", text: "Add Product (Admin Only)" },
  { href: "/user/cart", text: "Cart" },
  { href: "/user/pending", text: "Pending" },
  { href: "/user/orders", text: "Orders" },
  { href: "/user/settings", text: "Settings" },
];
