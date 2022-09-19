import request from "supertest";
import { faker } from "@faker-js/faker";
import { IUserService } from "../src/interfaces/IUserService";
import prismaClient from "../src/database";
import UserService from "../src/modules/user/user.service";
import app from "../src/app";

describe("AuthController", () => {
  let userService: IUserService;

  beforeAll(async () => {
    userService = new UserService();
    await prismaClient.$connect();
  });

  it("[integration] should be able to authenticate with valid credentials", async () => {
    const userData = {
      name: faker.name.fullName({
        firstName: "Firstname-",
      }),
      username: faker.internet.userName("Username-"),
      email: faker.internet.email(),
      phone: faker.phone.number("###############"),
      password: faker.internet.password(15),
    };

    await userService.store(userData);

    const response = await request(app).post("/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    await userService.destroy(response.body.user.id);
  });

  it("[integration] should be able to forget a password", async () => {
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

    const response = await request(app).post("/auth/forgot").send({
      email: userData.email,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
  });

  it("[integration] should be able to reset a password", async () => {
    const userData = {
      name: faker.name.fullName({
        firstName: "Firstname-",
      }),
      username: faker.internet.userName("Username-"),
      email: faker.internet.email(),
      phone: faker.phone.number("##############"),
      password: faker.internet.password(15),
    };

    const user = await userService.store(userData);

    const forgotPasswordResponse = await request(app)
      .post("/auth/forgot")
      .send({
        email: userData.email,
      });

    expect(forgotPasswordResponse.status).toBe(200);
    expect(forgotPasswordResponse.body).toHaveProperty("message");

    const getUserResponse = await userService.findByPk(user.id);

    const resetPasswordResponse = await request(app)
      .post("/auth/forgot")
      .send({
        email: userData.email,
        token: getUserResponse?.password_reset_token,
        password: faker.internet.password(15),
      });

    expect(resetPasswordResponse.status).toBe(200);
    expect(resetPasswordResponse.body).toHaveProperty("message");
  });

  it("[integration] should be able to get an user by token", async () => {
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

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty("token");

    const getUserResponse = await request(app).get(`/auth/jwt/${token}`).send({
      email: userData.email,
      password: userData.password,
    });

    expect(getUserResponse.status).toBe(200);
    expect(getUserResponse.body).toHaveProperty("token");
    expect(getUserResponse.body.user).toHaveProperty("id");
    expect(getUserResponse.body.user.email).toBe(userData.email);

    await userService.destroy(loginResponse.body.user.id);
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });
});
