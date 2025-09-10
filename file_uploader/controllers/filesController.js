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

        const userFolderMain = `./uploads/${req.user.username}/main`;

        if (!fs.existsSync(userFolderMain)) {
            fs.mkdirSync(userFolderMain, { recursive: true });
        }

        cb(null, userFolderMain);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});

const upload = multer({fileFilter: fileFilter, storage: storage}).single('uploadedFile');

const fileUploadValidation = [
    check('uploadedFile')
        .custom((value, { req }) => !!req.file)
        .withMessage("Please provide a file to upload"),
    check('folderName')
        .optional()
];

export const uploadFilePost = [
    (req, res, next) => {
        upload(req, res, (err) => {
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
            fs.unlink(currentFile.path); //Manually delete file since its already uploaded on multer call above
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
            //File size limit
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
            //Check for file size limit of current file wrt file type
            const maxAllowed = Object.entries(limits).find(([key]) => type.includes(key))?.[1];
            //File size limit check
            if (maxAllowed && size > maxAllowed) {
                fs.unlink(currentFile.path); //Manually delete file since its already uploaded on multer call above
                throw new FileUploadError(
                `File too large for ${type} uploaded file type. Max size is ${maxAllowed / 1024 / 1024}MB`,
                409,
                "MULTER_MAX_FILE_SIZE_ERROR",
                { detail: `Max size is ${maxAllowed / 1024 / 1024}MB for ${type} file type` }
                );
            }
            //Change file destination from default (main) to folderName
            const destinationFolder = req.body.folderName;
            const currentFilePath = req.file.path;
            //const currentFileDestination = req.file.destination;
            const currentFileName = req.file.filename;

            if(destinationFolder !== "" && destinationFolder !== "main") {
                //Since default file destination is upload/{username}/main if a custom folder is specified it needs to be moved there
                const newDest = `uploads/${destinationFolder}`;
                const newPath = `${newDest}/${currentFileName}`;
                await fs.promises.mkdir(`${newDest}`, { recursive: true });
                await fs.promises.rename(currentFilePath, newPath);
                //Overwrite current file's destination
                req.file.destination = newDest;
                req.file.path = newPath;
                
                /* --Create folder record in prisma if is not yet existing, then link in currently logged user -- */
                const folderRecord = await prisma.retrievedFolderByName(req.user.id, destinationFolder)
                //If folder is not existing then create
                if(!folderRecord) {
                    await prisma.createFolder(req.user.id, destinationFolder)
                }
                /* --Create file record in prisma, then link in logged user and current destinationFolder -- */
                
            } else { //If no destinationFolder specified - destinationFolder is main by default
                
            }
        }

        res.redirect("/dashboard");
    }),
];

export async function filesHome () {
    return res.render("fileHome", {
        title: "My Files",
        header: `Hi ${req.user.username}. Listed below are all files belonging to you.`,
        notAuthenticatedLinks,
        memberAuthenticatedLinks
    });
}