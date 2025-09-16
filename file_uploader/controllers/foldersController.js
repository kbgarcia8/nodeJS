import { check, validationResult } from "express-validator";
//utils
import { notAuthenticatedLinks, memberAuthenticatedLinks, guestAuthenticatedLinks, adminAuthenticatedLinks, icons } from "../constants/constants.js";
import { formatDateTime } from "../utils/utility.js";
import path from 'path';
import asyncHandler from "express-async-handler";
//prisma queries
import * as prisma from "../prisma/prisma.js";
//authentication
import bcrypt from "bcryptjs";
import passport from "passport";

export async function foldersHome (req, res) {

    const userAllFolders = await prisma.retrieveAllFolderOfUser(req.user.id);

    const foldersWithFormattedDate = userAllFolders.map((file) => {
        return {
            ...file, 
            created_at: formatDateTime(file.created_at)
        }
    })

    return res.render("foldersHome", {
        title: "My Files",
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

    console.log(folderFilesWithFormattedDate);

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