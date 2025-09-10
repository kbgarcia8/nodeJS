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
    } catch (err){
        console.error("Database error in createUser:", err);
        throw new PrismaError("Failed to create user in database", 409, "PRISMA_CREATE_USER_FAILED", {
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
    console.error("Database error in findUserByEmail:", err);
      throw new PrismaError("Failed to create user in database", 409, "PRISMA_FIND_USER_BYEMAIL_FAILED", {
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
    console.error("Database error in findUserById:", err);
      throw new PrismaError("Failed to create user in database", 409, "PRISMA_FIND_USER_BYEMAIL_FAILED", {
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
      }
    });

    console.log(`Folder ${name} under ${user_id} created`);

  } catch(err){
    console.error("Database error in createFolder:", err);
      throw new PrismaError("Failed to create folder", 409, "PRISMA_CREATE_FOLDER_FAILED", {
          detail: err.error || err.message,
      });
  }
}
export async function retrievedFolderByName(user_id, name){
  try {
    const retriveFolder = await prisma.folder.findUnique({
      where: {
        name: name,
        userId: user_id //both attribute are part of a composite primary key
      },
      include: {
        files: true
      }
    });

    console.log(`Folder ${name} under ${user_id} created`);
    return retriveFolder;

  } catch(err){
    console.error("Database error in createFolder:", err);
      throw new PrismaError("Failed to create folder", 409, "PRISMA_CREATE_FOLDER_FAILED", {
          detail: err.error || err.message,
      });
  }
}
/* -- END FOLDER -- */
/* -- FILE -- */
export async function createFile(user_id, name){
  try {
    const createUserFile = await prisma.file.create({
      data: {
        name: name,
        user: {
          connect: { id: user_id }
        }
      }
    });

    console.log(`File ${name} under ${user_id} created`);

  } catch(err){
    console.error("Database error in createFile:", err);
      throw new PrismaError("Failed to create file", 409, "PRISMA_CREATE_FILE_FAILED", {
          detail: err.error || err.message,
      });
  }
}
/* -- END FILE -- */