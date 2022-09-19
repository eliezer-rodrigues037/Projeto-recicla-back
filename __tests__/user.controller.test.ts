import request from "supertest";
import { faker } from "@faker-js/faker";
import fs from "fs";
import { resolve } from "path";
import { IUserService } from "../src/interfaces/IUserService";
import prismaClient from "../src/database";
import app from "../src/app";
import UserService from "../src/modules/user/user.service";

describe("UserController", () => {
  let userService: IUserService;

  beforeAll(async () => {
    userService = new UserService();
    await prismaClient.$connect();
  });

  it("[integration] should be able to create an user while authenticated", async () => {
    const userData = {
      name: faker.name.fullName({
        firstName: "Firstname-",
      }),
      username: faker.internet.userName("Username-"),
      email: faker.internet.email(),
      phone: faker.phone.number("##############"),
      password: faker.internet.password(15),
    };

    await userService.store(userData);

    const loginResponse = await request(app).post("/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    const { token } = loginResponse.body;

    const mockPostData = {
      name: faker.name.fullName({
        firstName: "Firstname-",
      }),
      username: faker.internet.userName("Username-"),
      email: faker.internet.email(),
      phone: faker.phone.number("##############"),
      password: faker.internet.password(15),
    };

    const response = await request(app)
      .post("/users")
      .send(mockPostData)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty("id");
    expect(response.body).toHaveProperty("token");

    await userService.destroy(response.body.user.id);
  });

  it("[integration] should not be able to create an user while not authenticated", async () => {
    const userData = {
      name: faker.name.fullName({
        firstName: "Firstname-",
      }),
      username: faker.internet.userName("Username-"),
      email: faker.internet.email(),
      phone: faker.phone.number("##############"),
      password: faker.internet.password(15),
    };

    const response = await request(app).post("/users").send(userData);

    expect(response.status).toBe(401);
  });

  it("[integration] should be able to get all users", async () => {
    const userData = {
      name: faker.name.fullName({
        firstName: "Firstname-",
      }),
      username: faker.internet.userName("Username-"),
      email: faker.internet.email(),
      phone: faker.phone.number("##############"),
      password: faker.internet.password(15),
    };

    await userService.store(userData);

    const loginResponse = await request(app).post("/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    const { token } = loginResponse.body;

    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("[integration] should be able to get an user by id", async () => {
    const userData = {
      name: faker.name.fullName({
        firstName: "Firstname-",
      }),
      username: faker.internet.userName("Username-"),
      email: faker.internet.email(),
      phone: faker.phone.number("##############"),
      password: faker.internet.password(15),
    };

    await userService.store(userData);

    const loginResponse = await request(app).post("/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    const { token } = loginResponse.body;
    const { id } = loginResponse.body.user;

    const response = await request(app)
      .get(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(loginResponse.body.user.email);
  });

  it("[integration] should be able to add an user avatar", async () => {
    const userData = {
      name: faker.name.fullName({
        firstName: "Firstname-",
      }),
      username: faker.internet.userName("Username-"),
      email: faker.internet.email(),
      phone: faker.phone.number("##############"),
      password: faker.internet.password(15),
    };

    await userService.store(userData);

    const loginResponse = await request(app).post("/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    const { token } = loginResponse.body;
    const { id } = loginResponse.body.user;

    const avatarFilePath = resolve(
      `${__dirname}/../assets/mind-consulting.png`
    );

    const data = fs.readFileSync(avatarFilePath);

    const convertedData = data.toString("base64");

    const avatarBuffer = Buffer.from(convertedData, "base64");

    const response = await request(app)
      .patch(`/users/${id}/avatar`)
      .set("Authorization", `Bearer ${token}`)
      .attach("avatar", avatarBuffer, avatarFilePath);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
  });

  it("[integration] should be able to remove an user avatar", async () => {
    const userData = {
      name: faker.name.fullName({
        firstName: "Firstname-",
      }),
      username: faker.internet.userName("Username-"),
      email: faker.internet.email(),
      phone: faker.phone.number("##############"),
      password: faker.internet.password(15),
    };

    await userService.store(userData);

    const loginResponse = await request(app).post("/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    const { token } = loginResponse.body;
    const { id } = loginResponse.body.user;

    const avatarFilePath = resolve(
      `${__dirname}/../assets/mind-consulting.png`
    );

    const data = fs.readFileSync(avatarFilePath);

    const convertedData = data.toString("base64");

    const avatarBuffer = Buffer.from(convertedData, "base64");

    const addAvatarResponse = await request(app)
      .patch(`/users/${id}/avatar`)
      .set("Authorization", `Bearer ${token}`)
      .attach("avatar", avatarBuffer, avatarFilePath);

    expect(addAvatarResponse.status).toBe(200);
    expect(addAvatarResponse.body).toHaveProperty("message");

    const removeAvatarResponse = await request(app)
      .patch(`/users/${id}/remove-avatar`)
      .set("Authorization", `Bearer ${token}`);

    expect(removeAvatarResponse.status).toBe(200);
    expect(removeAvatarResponse.body).toHaveProperty("message");
  });

  it("[integration] should be able to update an user", async () => {
    const userData = {
      name: faker.name.fullName({
        firstName: "Firstname-",
      }),
      username: faker.internet.userName("Username-"),
      email: faker.internet.email(),
      phone: faker.phone.number("##############"),
      password: faker.internet.password(15),
    };

    await userService.store(userData);

    const loginResponse = await request(app).post("/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    const { token } = loginResponse.body;
    const { id } = loginResponse.body.user;

    const updateUserResponse = await request(app)
      .put(`/users/${id}`)
      .send({
        name: faker.name.fullName(),
        username: faker.internet.userName(),
        phone: faker.phone.number("##############"),
      })
      .set("Authorization", `Bearer ${token}`);

    expect(updateUserResponse.status).toBe(200);
    expect(updateUserResponse.body).toHaveProperty("message");
  });

  it("[integration] should be able to delete an user", async () => {
    const userData = {
      name: faker.name.fullName({
        firstName: "Firstname-",
      }),
      username: faker.internet.userName("Username-"),
      email: faker.internet.email(),
      phone: faker.phone.number("##############"),
      password: faker.internet.password(15),
    };

    await userService.store(userData);

    const loginResponse = await request(app).post("/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    const { token } = loginResponse.body;
    const { id } = loginResponse.body.user;

    const deleteUserResponse = await request(app)
      .delete(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteUserResponse.status).toBe(200);
    expect(deleteUserResponse.body).toHaveProperty("message");
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });
});
