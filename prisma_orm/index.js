import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
  //Write your Prisma Client queries here
  /* CREATE
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
      posts: {
        create: { title: 'Hello World' },
      },
      profile: {
        create: { bio: 'I like turtles' },
      },
    },
  })
  */
  //UPDATE
  const post = await prisma.post.update({
    where: { id: 1 },
    data: { published: true },
  })
  console.log(post)
  //SELECT
  const allUsers = await prisma.user.findMany({ //SELECT * FROM <table>
    include: { //include is saying to include all table information of a related column
      posts: true,
      profile: true,
    },
  })
  console.dir(allUsers, { depth: null })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })