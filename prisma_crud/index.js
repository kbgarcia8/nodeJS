import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

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

main()