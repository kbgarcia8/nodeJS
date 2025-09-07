export const notAuthenticatedLinks = [
    {href: '/login', text: "Login"},
    {href: '/register', text: "Register"},
]

export const guestAuthenticatedLinks = [
  { href: "/dashboard", text: "Public Files" },
  { href: "/files", text: "My Filess" },
  { href: "/files/new", text: "New Files" },
  { href: "/users/upgrade", text: "Upgrade" },
  { href: "/logout", text: "Logout" },
];


export const memberAuthenticatedLinks = [
  { href: "/dashboard", text: "Public Files" },
  { href: "/files", text: "My Files" },
  { href: "/files/new", text: "New Files" },
  { href: "/files/search", text: "Search Files" },
  { href: "/users/search", text: "Search User" },
  { href: "/logout", text: "Logout" },
];

export const adminAuthenticatedLinks = [
  { href: "/dashboard", text: "Public Files" },
  { href: "/message", text: "My Filess" },
  { href: "/files/new", text: "New Files" },
  { href: "/files/search", text: "Search Files" },
  { href: "/users", text: "All Users" },
  { href: "/users/create", text: "Create User" },  
  { href: "/users/search", text: "Search User" },
  { href: "/logout", text: "Logout" },
];