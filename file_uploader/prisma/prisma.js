import { PrismaClient } from '@prisma/client';

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
/* -- END USERS -- */
/*
async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main().catch((e) => {
  console.error('Error:', e);
});
*/