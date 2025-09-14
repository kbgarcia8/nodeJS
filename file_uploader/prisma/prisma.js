import { FileUploadError } from '../utils/errors.js';
import { PrismaClient } from './schema/generated/prisma/index.js';

const prisma = new PrismaClient({})
/* -- USERS -- */
export async function createUser(firstName, lastName, username, email, password, role){
    try {
        const data= {
          firstName: firstName,
          lastName: lastName,
          username: username,
          email: email,
          password: password,
        }
        //This is advised rather than including role: role || USER since if role will be undefined prisma will consider it as null. So now if role is not provided it will not be included in data and the default value in the schema will be used
        if (role !== undefined) {
          data.role = role;
        }

        const newUser = await prisma.user.create({ data });
        console.log("User created successfully!")
        /*Create uploads/{username} and uploads/{username}/main in prisma folder records to make sure that main will always be folderId = 1*/
        await prisma.folder.create({
          data: {
            name: "main",
            user: {
              connect: { id: newUser.id }
            }
          }
        });
    } catch (err){
      console.error("Prisma Database error in createUser:", err);
      throw new FileUploadError("Failed to create user in database", 409, "PRISMA_CREATE_USER_FAILED", {
        detail: err.error || err.message,
      });
    }
}
export async function findUserByEmail(email){
  try {
    const retrievedUser = await prisma.user.findUnique({
      where: {
        email: email
      },
      include: {
        folder: true,
        files: true
      }
    });

    return retrievedUser;

  } catch(err){
    console.error("Prisma Database error in findUserByEmail:", err);
      throw new FileUploadError("Failed to create user in database", 409, "PRISMA_FIND_USER_BYEMAIL_FAILED", {
          detail: err.error || err.message,
      });
  }
}
export async function findUserById(id){
  try {
    const retrievedUser = await prisma.user.findUnique({
      where: {
        id: id
      },
      include: {
        folder: true,
        files: true
      }
    });

    return retrievedUser;

  } catch(err){
    console.error("Prisma Database error in findUserById:", err);
      throw new FileUploadError("Failed to create user in database", 409, "PRISMA_FIND_USER_BYEMAIL_FAILED", {
          detail: err.error || err.message,
      });
  }
}
/* -- END USERS -- */

/* -- FOLDER -- */
export async function createFolder(name, userId){
  try {
    const createUserFolder = await prisma.folder.create({
      data: {
        name: name,
        user: {
          connect: { id: userId }
        }
      },
      include: {
        files: true
      }
    });

    console.log(`Folder ${name} under ${userId} created`);

    return createUserFolder;

  } catch(err){
    console.error("Prisma Database error in createFolder:", err);
    throw new FileUploadError("Failed to create folder", 409, "PRISMA_CREATE_FOLDER_FAILED", {
      detail: err.error || err.message,
    });
  }
}
export async function retrievedFolderByName(name, userId){
  try {
    const retriveFolder = await prisma.folder.findUnique({
      where: {
        name_userId: { //both attribute are part of a composite primary key
          name: name,
          userId: userId
        }
      },
      include: {
        files: true
      }
    });

    console.log(`Folder ${name} under ${userId} created`);
    return retriveFolder;

  } catch(err){
    console.error("Prisma Database error in createFolder:", err);
    throw new FileUploadError("Failed to create folder", 409, "PRISMA_CREATE_FOLDER_FAILED", {
      detail: err.error || err.message,
    });
  }
}
/* -- END FOLDER -- */

/* -- FILE -- */
export async function createFileRecord(type, name, path, size, userId, folderId){
  const currentUserMainFolder = await retrievedFolderByName("main", userId);
  const currentUserMainFolderId = parseInt(currentUserMainFolder?.id);

  try {
    const createUserFile = await prisma.file.create({
      data: {
        fileType: type,
        name: name,
        path: path,
        size: size,
        user: {
          connect: { id: userId }
        },
        folder: {
          connect: { id: folderId !== undefined ? folderId : currentUserMainFolderId} //connect to main of current user by default
        }
      }
    });

    console.log(`File ${name} under ${userId} created`);

  } catch(err){
    console.error("Prisma Database error in createFile:", err);
    throw new FileUploadError("Failed to create file", 409, "PRISMA_CREATE_FILE_FAILED", {
        detail: err.error || err.message,
    });
  }
}
export async function retrieveFileById(user, fileId){
  try {
    const retrievedFile = await prisma.file.findUnique({
      where: {
        id: fileId
      },
      include:{
        folder: true,
        user: true
      }
    });

    console.log(`File id ${fileId} under ${user.username} is retrieved`);
    return retrievedFile;

  } catch(err){
    console.error("Prisma Database error in retrieveFileById:", err);
    throw new FileUploadError("Failed to retrieve file", 409, "PRISMA_RETRIEVE_FILE_BY_ID_FAILED", {
        detail: err.error || err.message,
    });
  }
}
export async function deleteFileById(user, fileId){
  try {
    const deleteUserFile = await prisma.file.delete({
      where: {
        id: fileId
      }
    });

    console.log(`File id ${fileId} under ${user.username} deleted`);

  } catch(err){
    console.error("Prisma Database error in deleteFileById:", err);
    throw new FileUploadError("Failed to delete file", 409, "PRISMA_DELETE_FILE_BY_ID_FAILED", {
        detail: err.error || err.message,
    });
  }
}
export async function retrieveAllFilesByUser(userId){
  try{
    const allUserFiles = await prisma.file.findMany({
      where: {
        userId: userId
      },
      include: {
        folder: true,
        user: true
      }
    })

    return allUserFiles;
  } catch (err){
    console.error("Prisma Database error in retrieveAllFilesByUser:", err);
    throw new FileUploadError("Failed to retrieve files owned by user in database", 409, "PRISMA_RETRIEVE_FILES_FAILED", {
      detail: err.error || err.message,
    });
  }
}
/* -- END FILE -- */