import { Role } from "../prisma/schema/generated/prisma/index.js";

export const notAuthenticatedLinks = [
    {href: '/login', text: "Login"},
    {href: '/register', text: "Register"},
]
//Can only store files in a main folder
//Limit storage capacity
export const guestAuthenticatedLinks = [
  { href: "/dashboard", text: "Public Files" },
  { href: "/files", text: "My Files" },
  { href: "/files/new", text: "Upload File/s" },
  { href: "/users/upgrade", text: "Upgrade" },
  { href: "/logout", text: "Logout" },
];
//Can store file in a custom folder
export const memberAuthenticatedLinks = [
  { href: "/dashboard", text: "Public Files" },
  { href: "/files", text: "My Files" }, //list of all files
  { href: "/folders", text: "My Folders" }, //list of all folders
  { href: "/folders/search", text: "Search Folders" },
  { href: "/files/new", text: "Upload File/s" },
  { href: "/files/search", text: "Search Files" },
  { href: "/logout", text: "Logout" },
];
//Can create and delete user
//Can delete files/folders that are not adhering policy/ nor safe
export const adminAuthenticatedLinks = [
  { href: "/dashboard", text: "Public Files" },
  { href: "/message", text: "My Files" },
  { href: "/files/new", text: "Upload File/s" },
  { href: "/files/search", text: "Search Files" },
  { href: "/folders/new", text: "Create Folder" },
  { href: "/folders/search", text: "Search Folders" },
  { href: "/users", text: "All Users" },
  { href: "/users/create", text: "Create User" },  
  { href: "/users/search", text: "Search User" },
  { href: "/logout", text: "Logout" },
];

/* Misc */
export const icons = {
    'image': "🖼️",
    'application/pdf': "📕",
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': "📄",
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': "𝄜",
    'text/plain': "📃",
    'audio/mpeg': "🔊",
    'audio/wav': "🔊",
    'video/mp4': "📽️",
    'application/zip': "🔐"
};
export const roles = Object.values(Role);