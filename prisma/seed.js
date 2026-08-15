import { prisma } from "../src/libs/prisma.js";
import bcrypt from "bcryptjs";
const hashedPassword = bcrypt.hashSync("123456", 8);
const userData = [
  {
    username: "Harry",
    password: hashedPassword,
    email: "harry@gmail.com",
    profileImage: "https://www.svgrepo.com/show/420364/avatar-male-man.svg",
  },
  {
    username: "Shaw",
    password: hashedPassword,
    email: "shaw@gmail.com",
    profileImage:
      "https://www.svgrepo.com/show/420319/actor-chaplin-comedy.svg",
  },
];
async function main() {
  console.log("Start clean table...");
  (await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 0;"),
    await prisma.$executeRaw`TRUNCATE TABLE User`); // ถ้าอยากล้างหลาย Table ให้แทนด้วย code ใน Note ด้านล่าง
  (await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 1;"),
    console.log("Start seeding..."));
  const createdUsers = await prisma.user.createMany({
    data: userData,
    skipDuplicates: true,
  });
  console.log(`Created ${createdUsers.count} users.`);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
