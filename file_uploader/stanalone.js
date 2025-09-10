// * This is for tesiting scripts or invoking standalone prisma queries
import * as prisma from './prisma/prisma.js';

(async function main () {
    await prisma.createFolder(1, "main")
    await prisma.createFolder(2, "main")
})()