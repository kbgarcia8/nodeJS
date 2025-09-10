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
export async function createFolder(user_id, name){
  try {
    const createUserFolder = await prisma.folder.create({
      data: {
        name: name,
        user: {
          connect: { id: user_id }
        }
      },
      include: {
        files: true
      }
    });

    console.log(`Folder ${name} under ${user_id} created`);

    return createUserFolder;

  } catch(err){
    console.error("Prisma Database error in createFolder:", err);
    throw new FileUploadError("Failed to create folder", 409, "PRISMA_CREATE_FOLDER_FAILED", {
      detail: err.error || err.message,
    });
  }
}
export async function retrievedFolderByName(user_id, name){
  try {
    const retriveFolder = await prisma.folder.findUnique({
      where: {
        userId_name: { //both attribute are part of a composite primary key
          userId: user_id, 
          name: name
        }
      },
      include: {
        files: true
      }
    });

    console.log(`Folder ${name} under ${user_id} created`);
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
export async function createFileRecord(type, name, path, size, user_id, folder_id){
  const currentUserMainFolder = await retrievedFolderByName("main", user_id);
  const currentUserMainFolderId = parseInt(currentUserMainFolder?.id);

  try {
    const createUserFile = await prisma.file.create({
      data: {
        fileType: type,
        name: name,
        path: path,
        size: size,
        user: {
          connect: { id: user_id }
        },
        folder: {
          connect: { id: folder_id !== undefined ? folder_id : currentUserMainFolderId} //connect to main of current user by default
        }
      }
    });

    console.log(`File ${name} under ${user_id} created`);

  } catch(err){
    console.error("Prisma Database error in createFile:", err);
    throw new FileUploadError("Failed to create file", 409, "PRISMA_CREATE_FILE_FAILED", {
        detail: err.error || err.message,
    });
  }
}
export async function retrieveAllFilesByUser(user_id){
  try{
    const allUserFiles = await prisma.file.findMany({
      where: {
        userId: user_id
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