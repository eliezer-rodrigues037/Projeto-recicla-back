// eslint-disable-next-line no-unused-vars
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import prismaClient from "../src/database";

(async function main() {
  try {
    const generatedPassword = faker.internet.password();

    const user = await prismaClient.user.create({
      data: {
        name: "Admin",
        email: "reciclaadmin@email.com",
        role: "Admin",
        password: bcrypt.hashSync(generatedPassword, 10),
        birthDate: new Date("1998-07-30"),
        cpf: "123.456.789-10",
        cel: "(99) 99999-9999",
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
