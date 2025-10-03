import Location from "../models/location.ts";
import Building from "../models/building.ts";
import Lecturer from "../models/lecturer.ts";
import Office from "../models/office.ts";
import initDB from "../db.ts";
import { configDotenv } from "dotenv";
import {faker} from "@faker-js/faker";


// Prevent accidental seeding in production
if(process.env.NODE_ENV === "production"){
  console.log("Seeding should not be done in production");
  process.exit(0);
}

// //Future proofing for when we run this script on startup if the database is empty
// if (require.main === module) {
//   console.log("The script is being run directly");
//   configDotenv();
//   initDB();
// }
// else {
//     console.log("The script is being run by another script passing to it");
//     if (await Location.find().countDocuments() === 0) {
//         seedDatabase();
//     }
// }




const location = Array.from({ length: 20 }).map(() => ({
  name: faker.location.city(),
  shortName: faker.location.city(),
  address: faker.location.streetAddress(),
  lat: faker.location.latitude(),
  lng: faker.location.longitude(),
  type: faker.helpers.arrayElement(["academic", "library", "administration", "sports", "residence"]),
  description: faker.lorem.sentence(),
  facilities: faker.helpers.arrayElements([
    "Computer Labs",
    "Lecture Halls",
    "Engineering Labs",
    "Science Labs",
    "Research Centers",
    "Study Areas",
    "Archives",
    "Group Study Rooms",
    "Student Services",
    "Registrar",
    "Finance Office",
    "Gymnasium",
    "Swimming Pool",
    "Sports Fields",
    "Fitness Center",
    "Dining Hall",
    "Recreation Room"
  ])
}));

const building = Array.from({ length: 20 }).map(() => ({
  name: faker.company.name(),
  lat: faker.location.latitude(),
  lng: faker.location.longitude(),
  offices: faker.helpers.arrayElements([faker.database.mongodbObjectId(), faker.database.mongodbObjectId(), faker.database.mongodbObjectId()]),
}));

const lecturer = Array.from({ length: 20 }).map(() => ({
  name: faker.person.fullName(),
  title: faker.person.jobTitle(),
  department: faker.helpers.arrayElement(["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology"]),
  email: faker.internet.email()
}));

const office = Array.from({ length: 20 }).map(() => ({
  name: faker.company.name(),
  building: faker.helpers.arrayElement([faker.database.mongodbObjectId(), faker.database.mongodbObjectId(), faker.database.mongodbObjectId()]),
  lecturers: faker.helpers.arrayElements([faker.database.mongodbObjectId(), faker.database.mongodbObjectId(), faker.database.mongodbObjectId()]),
}));

configDotenv();
await initDB();
await seedDatabase().then(() => {
  process.exit(0);
});

async function seedDatabase() {
  await Location.deleteMany({});
  await Location.insertMany(location);
  await Building.deleteMany({});
  await Building.insertMany(building);
  await Lecturer.deleteMany({});
  await Lecturer.insertMany(lecturer);
  await Office.deleteMany({});
  await Office.insertMany(office);
  console.log("Database seeded!");
}

export default seedDatabase;