import { check, validationResult } from "express-validator";
//utils
import { notAuthenticatedLinks, memberAuthenticatedLinks } from "../constants/constants.js";
import { formatDateTime } from "../utils/utility.js";
import path from 'path';
import asyncHandler from "express-async-handler";
//prisma queries
import * as prisma from "../prisma/prisma.js";
//authentication
import bcrypt from "bcryptjs";
import passport from "passport";

export async function filesHome (req, res) {

    const userAllFolders = await prisma.retrieveAllFolderOfUser(req.user.id);

    const foldersWithFormattedDate = userAllFolders.map((file) => {
        return {
            ...file, 
            created_at: formatDateTime(file.created_at)
        }
    })

    return res.render("filesHome", {
        title: "My Files",
        header: `Hi ${req.user.username}. Listed below are all files belonging to you.`,
        notAuthenticatedLinks,
        memberAuthenticatedLinks,
        files: filesWithFormattedDate,
        user: req.user,
        icons
    });
}