import { check, validationResult } from "express-validator";
import { notAuthenticatedLinks, memberAuthenticatedLinks } from "../constants/constants.js";
import { ExpressValError } from "../utils/errors.js";
import asyncHandler from "express-async-handler";
import * as prisma from "../prisma/prisma.js";
//authentication
import bcrypt from "bcryptjs";
import passport from "passport";
//File upload
import multer from 'multer';
import { FileUploadError } from "../utils/errors.js";
//fs
import fs from 'fs';

export async function uploadFileGet(req,res){
    return res.render("fileUpload", {
        title: "Upload a File",
        header: `Hi ${req.user.username}, you can upload your files below.`,
        notAuthenticatedLinks,
        memberAuthenticatedLinks
    });
};

//Ensure file type is supported by multer
//NOTE cb () here is like next ()
const fileFilter = (req, file, cb) => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if(imageTypes.includes(file.mimetype)) {
        cb(null, true)
    } else if(file.mimetype === 'application/pdf') {
        cb(null, true)
    } else if(file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        cb(null, true)
    } else  if(file.mimetype === 'text/plain' && file.size <= (2 * 1024 * 1024)) {
        cb(null, true)
    } else  if(file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/wav') {
        cb(null, true)
    } else if(file.mimetype === 'video/mp4' && file.size <= (150 * 1024 * 1024)) {
        cb(null, true)
    } else if(file.mimetype === 'application/zip' && file.size <= (100 * 1024 * 1024)) {
        cb(null, true)
    } else {
        cb(new FileUploadError(
            `Failed to upload file. Unsuported file type`,
            409,
            "MULTER_UNSUPPORTED_FILE_TYPE_ERROR",
            {detail: `File type ${file.mimetype} unsupported`}
        ),
        false)
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userFolder = `./uploads/${req.user.username}`;

        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
        }

        cb(null, userFolder);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});

const upload = multer({fileFilter: fileFilter, storage: storage})

const fileUploadValidation = [
    check('uploadedFile')
        .custom((value, { req }) => !!req.file)
        .withMessage("Please provide a file to upload")
];

export const uploadFilePost = [
    (req, res, next) => {
        upload.single('uploadedFile')(req, res, (err) => { // uploadedFile is from req.body
            if (err) {
                // Custom or Multer errors
                const message = err.message || "File upload failed";
                return res.render("fileUpload", {
                title: "Upload a File",
                header: `Hi ${req.user.username}, you can upload your files below.`,
                notAuthenticatedLinks,
                memberAuthenticatedLinks,
                errors: [{ msg: message }]
                });
            }
            next();
        });
    },
    fileUploadValidation,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.render("fileUpload", {
            title: "Upload a File",
            header: `Hi ${req.user.username}, you can upload your files below.`,
            notAuthenticatedLinks,
            memberAuthenticatedLinks,
            errors: errors.array(),
        });
        }

        const currentFile = req.file;

        if (currentFile) {
        const type = currentFile.mimetype;
        const size = currentFile.size;

        const limits = {
            'image': 10 * 1024 * 1024,
            'application/pdf': 20 * 1024 * 1024,
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 10 * 1024 * 1024,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 10 * 1024 * 1024,
            'text/plain': 2 * 1024 * 1024,
            'audio/mpeg': 50 * 1024 * 1024,
            'audio/wav': 50 * 1024 * 1024,
            'video/mp4': 150 * 1024 * 1024,
            'application/zip': 100 * 1024 * 1024
        };

        const maxAllowed = Object.entries(limits).find(([key]) => type.includes(key))?.[1];

        if (maxAllowed && size > maxAllowed) {
            throw new FileUploadError(
            `File too large for ${type} uploaded file type. Max size is ${maxAllowed / 1024 / 1024}MB`,
            409,
            "MULTER_MAX_FILE_SIZE_ERROR",
            { detail: `Max size is ${maxAllowed / 1024 / 1024}MB for ${type} file type` }
            );
        }
        }

        res.redirect("/dashboard");
    }),
];