export const notAuthenticatedLinks = [
    {href: '/login', text: "Login"},
    {href: '/register', text: "Register"},
]

export const guestAuthenticatedLinks = [
  { href: "/dashboard", text: "Public Files" },
  { href: "/files", text: "My Files" },
  { href: "/files/new", text: "Upload File/s" },
  { href: "/users/upgrade", text: "Upgrade" },
  { href: "/logout", text: "Logout" },
];

export const memberAuthenticatedLinks = [
  { href: "/dashboard", text: "Public Files" },
  { href: "/files", text: "My Files" }, //list of all files
  { href: "/files/folders", text: "My Folders" }, //list of all folders
  { href: "/files/new", text: "Upload File/s" },
  { href: "/files/search", text: "Search Files" },
  { href: "/users/search", text: "Search User" },
  { href: "/logout", text: "Logout" },
];

export const adminAuthenticatedLinks = [
  { href: "/dashboard", text: "Public Files" },
  { href: "/message", text: "My Files" },
  { href: "/files/new", text: "Upload File/s" },
  { href: "/files/search", text: "Search Files" },
  { href: "/users", text: "All Users" },
  { href: "/users/create", text: "Create User" },  
  { href: "/users/search", text: "Search User" },
  { href: "/logout", text: "Logout" },
];