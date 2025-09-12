import { check, validationResult } from "express-validator";
//utils
import { notAuthenticatedLinks, memberAuthenticatedLinks } from "../constants/constants.js";
import { formatDateTime } from "../utils/utility.js";
import path from 'path';
import { dirname } from "path";
import asyncHandler from "express-async-handler";
//prisma queries
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

// * Ensure file type is supported by multer
// ! Note: cb () here is like next ()
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
        //Note that this is folder creation on server/storage side
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
            await fs.promises.unlink(currentFile.path); //Manually delete file since its already uploaded on multer call above
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
                await fs.promises.unlink(currentFile.path); //Manually delete file since its already uploaded on multer call above
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
                //File is already uploaded to upload/{username}/main. If a custom folder is specified it needs to be moved there
                const newDest = `uploads/${req.user.username}/${destinationFolder}`;
                const newPath = `${newDest}/${currentFileName}`;
                if (fs.existsSync(newPath)) {
                    throw new FileUploadError("File already exists", 409, "FILE_ALREADY_EXISTS", {
                        detail: `A file named ${currentFileName} already exists in ${destinationFolder}`
                    });
                }
                await fs.promises.mkdir(`${newDest}`, { recursive: true });
                await fs.promises.rename(currentFilePath, newPath);
                //Overwrite current file's destination
                req.file.destination = newDest;
                req.file.path = newPath;
                
                /* --Create folder record in prisma if is not yet existing, then link in currently logged user -- */
                let folderRecord = await prisma.retrievedFolderByName(destinationFolder, req.user.id)
                //If folder is not existing then create
                if(!folderRecord) {
                    folderRecord = await prisma.createFolder(destinationFolder, req.user.id)
                }
                /* --Create file record in prisma, then link in logged user and current destinationFolder -- */
                const { mimetype, size, filename, path } = req.file

                await prisma.createFileRecord(mimetype, filename, path, size, req.user.id, folderRecord.id)
                
            } else { //If no destinationFolder specified - destinationFolder is main by default, also main is expected to be initiated in createUser
                const { mimetype, size, filename, path } = req.file
                await prisma.createFileRecord(mimetype, filename, path, size, req.user.id)
            }
        }
        res.redirect("/dashboard");
    }),
];

export async function filesHome (req, res) {

    const userAllFiles = await prisma.retrieveAllFilesByUser(req.user.id);

    const filesWithFormattedDate = userAllFiles.map((file) => {
        return {
            ...file, 
            uploaded_at: formatDateTime(file.uploaded_at),
            folder_name: file.folder.name
        }
    })

    const icons = {
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

export async function viewFile (req, res) {

    const fileId = parseInt(req.params.id);

    const fileForView = await prisma.retrieveFileById(req.user,fileId);

    const fileForViewWithFormattedDate = {
        ...fileForView,
        uploaded_at: formatDateTime(fileForView.uploaded_at),
        folder_name: fileForView.folder.name
    }
    
    const icons = {
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

    return res.render("viewFile", {
        title: "View File",
        header: `Hi ${req.user.username}, you are viewing file with file id: ${fileId}`,
        notAuthenticatedLinks,
        memberAuthenticatedLinks,
        file: fileForViewWithFormattedDate,
        user: req.user,
        icons
    });
}

export async function downloadFile (req, res) {

    const fileId = parseInt(req.params.id);
    const fileForDownload = await prisma.retrieveFileById(req.user,fileId);
    const filePath = path.join(process.cwd(), fileForDownload.path); //local storage for now

    res.download(filePath, (err) => {
        if (err) {
            throw new AppError("Failed to download file", 409, "DOWNLOAD_FILE_FAILED", {
                detail: err.error || err.message,
            });
        }
    });
    res.redirect(`/view/${fileId}`);
}

export async function deleteFile(req,res) {
    const fileId = parseInt(req.params.id);
    
    // * Delete file in server/local storage
    const currentFile = await prisma.retrieveFileById(req.user, fileId);
    await fs.promises.unlink(currentFile.path);
    
    // * Delete file record in prisma
    await prisma.deleteFileById(req.user, fileId)

    res.redirect("/files")
}