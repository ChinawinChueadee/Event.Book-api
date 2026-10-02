import { prisma } from "../src/libs/prisma.js";
import bcrypt from "bcryptjs";
const hashedPassword = bcrypt.hashSync("123456", 8);
const userData = [
  {
    username: "Admin",
    password: hashedPassword,
    email: "admin@gmail.com",
    role: "ADMIN",
  },
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
// วันที่ในอนาคตนับจากวันที่รัน seed เพื่อให้จองได้เสมอ
const daysFromNow = (days, hour = 19) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const categoryNames = ["TECH", "MUSIC", "ART", "DESIGN", "TALKS"];

const eventData = [
  {
    title: "Node.js Workshop",
    description: "Hands-on workshop building a REST API with Express and Prisma.",
    category: "TECH",
    eventDate: daysFromNow(7, 10),
    location: "Bangkok",
    capacity: 20,
    eventImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    host: "harry@gmail.com",
  },
  {
    title: "Synthwave Night Live",
    description: "An evening of retro electronic music and visuals.",
    category: "MUSIC",
    eventDate: daysFromNow(14),
    location: "Bangkok Arena",
    capacity: 100,
    eventImage:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    host: "shaw@gmail.com",
  },
  {
    title: "Ceramics Workshop",
    description: "Learn wheel throwing basics. All materials included.",
    category: "ART",
    eventDate: daysFromNow(21, 13),
    location: "Chiang Mai",
    capacity: 8,
    eventImage:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800&auto=format&fit=crop",
    host: "harry@gmail.com",
  },
  {
    title: "Design Systems Talk",
    description: "How teams scale UI with shared components and tokens.",
    category: "DESIGN",
    eventDate: daysFromNow(30, 18),
    location: "TCDC Bangkok",
    capacity: 50,
    host: "shaw@gmail.com",
  },
];

async function main() {
  console.log("Start clean tables...");
  await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 0;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE Booking;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE Event;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE User;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE Category;");
  await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 1;");

  console.log("Start seeding...");
  const createdCategories = await prisma.category.createMany({
    data: categoryNames.map((name) => ({ name })),
  });
  console.log(`Created ${createdCategories.count} categories.`);

  const createdUsers = await prisma.user.createMany({
    data: userData,
    skipDuplicates: true,
  });
  console.log(`Created ${createdUsers.count} users.`);

  const users = await prisma.user.findMany();
  const userIdByEmail = Object.fromEntries(users.map((u) => [u.email, u.id]));

  const events = [];
  for (const { host, ...event } of eventData) {
    events.push(
      await prisma.event.create({
        data: { ...event, userId: userIdByEmail[host] },
      }),
    );
  }
  console.log(`Created ${events.length} events.`);

  // Shaw จอง event ของ Harry และ Harry จอง event ของ Shaw
  const bookings = await prisma.booking.createMany({
    data: [
      { userId: userIdByEmail["shaw@gmail.com"], eventId: events[0].id, status: "CONFIRMED" },
      { userId: userIdByEmail["shaw@gmail.com"], eventId: events[2].id },
      { userId: userIdByEmail["harry@gmail.com"], eventId: events[1].id },
    ],
  });
  console.log(`Created ${bookings.count} bookings.`);
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
