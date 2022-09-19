import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import prismaClient from "../src/database";

(async function main() {
  try {
    const generatedPassword = faker.internet.password();

    const user = await prismaClient.user.create({
      data: {
        name: "Admin",
        username: "admin",
        email: "reciclaadmin@email.com",
        role: "Admin",
        password: bcrypt.hashSync(generatedPassword, 10),
      },
    });

    console.log({ message: "Admin was created with success!", user });
    console.log("Generated password was: ", generatedPassword);
  } catch (e) {
    console.log(e);
    process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
})();
