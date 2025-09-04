import { PrismaClient } from '@prisma/client'
import { PrismaError } from '../utils/errors.js';

const prisma = new PrismaClient({})
/* -- USERS -- */
export async function createUser(firstName, lastName, username, email, password){
    try {
        const newUser = await prisma.user.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                password: password
            },
        });
        console.log("User created successfully!")
    } catch (err){
        console.error("Database error in createUser:", err);
        throw new PrismaError("Failed to create user in database", 409, "PRISMA_CREATE_USER_FAILED", {
            detail: err.error || err.message,
        });
    }
}
// A `main` function so that you can use async/await
async function main() {
  const u = await prisma.user.create({
    include: {
      posts: {
        include: {
          categories: true,
        },
      },
    },
    data: {
      email: 'emma@prisma.io',
      posts: {
        create: [
          {
            title: 'My first post',
            categories: {
              connectOrCreate: [
                {
                  create: { name: 'Introductions' },
                  where: {
                    name: 'Introductions',
                  },
                },
                {
                  create: { name: 'Social' },
                  where: {
                    name: 'Social',
                  },
                },
              ],
            },
          },
          {
            title: 'How to make cookies',
            categories: {
              connectOrCreate: [
                {
                  create: { name: 'Social' },
                  where: {
                    name: 'Social',
                  },
                },
                {
                  create: { name: 'Cooking' },
                  where: {
                    name: 'Cooking',
                  },
                },
              ],
            },
          },
        ],
      },
    },
  })
}