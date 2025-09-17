import { check, validationResult, query } from "express-validator";
//utils
import { notAuthenticatedLinks, memberAuthenticatedLinks, guestAuthenticatedLinks, adminAuthenticatedLinks, icons } from "../constants/constants.js";
import { formatDateTime } from "../utils/utility.js";
//prisma queries
import * as prisma from "../prisma/prisma.js";

export async function foldersHome (req, res) {

    const userAllFolders = await prisma.retrieveAllFolderOfUser(req.user.id);

    const foldersWithFormattedDate = userAllFolders.map((file) => {
        return {
            ...file, 
            created_at: formatDateTime(file.created_at)
        }
    })

    return res.render("foldersHome", {
        title: "My Folders",
        header: `Hi ${req.user.username}. Listed below are all folders belonging to you.`,
        notAuthenticatedLinks,
        memberAuthenticatedLinks,
        folders: foldersWithFormattedDate,
        user: req.user
    });
};
export async function viewFilesOfFolder(req,res){
    const currentFolder = req.params.name;
    const folderViewed = await prisma.retrievedFolderByName(currentFolder, req.user.id);

    const folderFiles = folderViewed.files;
    
    const folderFilesWithFormattedDate = folderFiles.map((file) => {
        return {
            ...file, 
            uploaded_at: formatDateTime(file.uploaded_at),
            folder_name: folderViewed.name
        }
    });

    return res.render("filesHome", {
        title: `${folderViewed.name}`,
        header: `Hi ${req.user.username}. Listed below are all files belonging to folder ${folderViewed.name}.`,
        notAuthenticatedLinks,
        memberAuthenticatedLinks,
        guestAuthenticatedLinks,
        adminAuthenticatedLinks,
        files: folderFilesWithFormattedDate,
        user: req.user,
        icons
    });
};
export async function searchFolder (req, res){

    const userAllFolders = await prisma.retrieveAllFolderOfUser(req.user.id);

    const foldersWithFormattedDate = userAllFolders.map((folder) => {
        return {
            ...folder, 
            created_at: formatDateTime(folder.created_at)
        }
    })

    return res.render("searchFolders", {
        title: "Search Folders",
        notAuthenticatedLinks,
        memberAuthenticatedLinks,
        guestAuthenticatedLinks,
        adminAuthenticatedLinks,
        folders: foldersWithFormattedDate,
        user: req.user
    });
};
const validateFolderSearch = [
  // Just basic optional + trimming, no cross-field logic here
  query("searchFolderName").optional({ checkFalsy: true }).trim(),
  query("searchFolderOwner").optional({ checkFalsy: true }).trim(),
  //query("searchFolderType").optional({ checkFalsy: true }).trim(),

  // Cross-field logic in a separate middleware
  (req, res, next) => {
    //const { searchFolderName = "", searchFolderOwner = "", searchFolderType = "" } = req.query;
    const { searchFolderName = "", searchFolderOwner = "" } = req.query;

    //if (!searchFolderName && !searchFolderOwner && !searchFolderType) {
    if (!searchFolderName && !searchFolderOwner) {
      return next(new ExpressValError(
        "At least one of searchFolderName or searchFolderOwner must be provided.",
        400,
        "EXPRESS_VAL_ERROR_SEARCH_FOLDER",
        {
          detail: "Provide either a folder name or owner pattern to search folder.",
        }
      ));
    }

    next();
  },
];
export const folderSearchResult = [
  validateFolderSearch,
  async (req, res) => {
    const errors = validationResult(req);

    const userAllFolders = await prisma.retrieveAllFolderOfUser(req.user.id);

    const foldersWithFormattedDate = userAllFolders.map((folder) => {
        return {
            ...folder, 
            created_at: formatDateTime(folder.created_at)
        }
    })

    const {searchFolderName, searchFolderOwner} = req.query

    if (!errors.isEmpty()) {
      return res.status(400).render("searchFolders", {
        title: "Search Folders",
        header: `Hi ${req.user.username}, you can search your folders below.`,
        notAuthenticatedLinks,
        memberAuthenticatedLinks,
        guestAuthenticatedLinks,
        adminAuthenticatedLinks,
        user: req.user,
        folders: foldersWithFormattedDate,
        errors: errors.array(),
      });
    }

    const matchedFoldersRaw = await prisma.retrieveSearchedFolders(searchFolderName, searchFolderOwner)

    const matchedFolders = matchedFoldersRaw.map((folder) => {
        return {
            ...folder, 
            created_at: formatDateTime(folder.created_at)
        }
    })
    
    return res.render("searchedFolders", {
        title: "Searched Folders",
        header: `Hi ${req.user.username}. Folder search pattern; name: ${searchFolderName} | owner: ${searchFolderOwner}.`,
        notAuthenticatedLinks,
        memberAuthenticatedLinks,
        guestAuthenticatedLinks,
        adminAuthenticatedLinks,
        folders: matchedFolders,
        user: req.user,
        icons
    });
  }
];