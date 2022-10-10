/* eslint-disable no-await-in-loop */
// eslint-disable-next-line no-unused-vars
/* eslint-disable no-console */
// import fs from "fs";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import prismaClient from "../src/database";

(async function main() {
  try {
    const cpf = "123.456.789-10";
    const banc = await prismaClient.banc.create({
      data: {
        accountOwner: faker.name.fullName(),
        cpf,
        banc: faker.company.name(),
        agencyNumber: faker.random.numeric(10).toString(),
        agencyDg: faker.random.numeric(2).toString(),
        accountNumber: faker.random.numeric(10).toString(),
        accountDg: faker.random.numeric(2).toString(),
      },
    });
    const generatedPassword = faker.internet.password();

    const user = await prismaClient.user.create({
      data: {
        name: "Admin",
        email: "reciclaadmin@email.com",
        role: "Admin",
        password: bcrypt.hashSync(generatedPassword, 10),
        birthDate: new Date("1998-07-30"),
        cpf,
        cel: "(99) 99999-9999",
        bancId: banc.id,
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

(async function main() {
  const users = [];
  // let usersDoc;
  try {
    const generatedPassword = faker.internet.password();
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 20; i++) {
      const baseCpf = "999.999.789-10";
      const cpf = Array.from(baseCpf, (c) =>
        Math.random() < 0.5 && c !== "." && c !== "-"
          ? Math.floor(Math.random() * 10).toString()
          : c
      ).join("");
      const baseCel = "(99) 99999-9999";
      const cel = Array.from(baseCel, (c) =>
        Math.random() < 0.5 && c !== " " && c !== "(" && c !== ")" && c !== "-"
          ? Math.floor(Math.random() * 10).toString()
          : c
      ).join("");

      const banc = await prismaClient.banc.create({
        data: {
          accountOwner: faker.name.fullName(),
          cpf,
          banc: faker.company.name(),
          agencyNumber: faker.random.numeric(10).toString(),
          agencyDg: faker.random.numeric(2).toString(),
          accountNumber: faker.random.numeric(10).toString(),
          accountDg: faker.random.numeric(2).toString(),
        },
      });

      const user = await prismaClient.user.create({
        data: {
          name: faker.name.fullName(),
          email: faker.internet.email(),
          role: "User",
          password: bcrypt.hashSync(generatedPassword, 10),
          birthDate: faker.date.birthdate(),
          cpf,
          cel,
          bancId: banc.id,
        },
      });
      user.password = generatedPassword;
      users.push(user);
    }
    // WIP
    // usersDoc = JSON.stringify(users);
    // fs.writeFile("../docs/usersDoc.json", usersDoc, "utf-8", () =>
    //   console.log("created!")
    // );
  } catch (e) {
    console.log(e);
    process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
})();

(async function main() {
  try {
    // eslint-disable-next-line no-plusplus
    let previewsName;
    for (let i = 0; i < 10; i++) {
      const material = await prismaClient.material.create({
        data: {
          name: faker.science.chemicalElement().name,
          price: faker.finance.amount(5, 50, 2),
        },
      });
    }

    // WIP
    // usersDoc = JSON.stringify(users);
    // fs.writeFile("../docs/usersDoc.json", usersDoc, "utf-8", () =>
    //   console.log("created!")
    // );
  } catch (e) {
    console.log(e);
    process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
})();
