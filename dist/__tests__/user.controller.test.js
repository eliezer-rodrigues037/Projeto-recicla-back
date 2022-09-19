"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const faker_1 = require("@faker-js/faker");
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const database_1 = __importDefault(require("../src/database"));
const app_1 = __importDefault(require("../src/app"));
const user_service_1 = __importDefault(require("../src/modules/user/user.service"));
describe("UserController", () => {
    let userService;
    beforeAll(async () => {
        userService = new user_service_1.default();
        await database_1.default.$connect();
    });
    it("[integration] should be able to create an user while authenticated", async () => {
        const userData = {
            name: faker_1.faker.name.fullName({
                firstName: "Firstname-",
            }),
            username: faker_1.faker.internet.userName("Username-"),
            email: faker_1.faker.internet.email(),
            phone: faker_1.faker.phone.number("#############"),
            password: faker_1.faker.internet.password(15),
        };
        await userService.store(userData);
        const loginResponse = await (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            email: userData.email,
            password: userData.password,
        });
        const { token } = loginResponse.body;
        const mockPostData = {
            name: faker_1.faker.name.fullName({
                firstName: "Firstname-",
            }),
            username: faker_1.faker.internet.userName("Username-"),
            email: faker_1.faker.internet.email(),
            phone: faker_1.faker.phone.number("#############"),
            password: faker_1.faker.internet.password(15),
        };
        const response = await (0, supertest_1.default)(app_1.default)
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
            name: faker_1.faker.name.fullName({
                firstName: "Firstname-",
            }),
            username: faker_1.faker.internet.userName("Username-"),
            email: faker_1.faker.internet.email(),
            phone: faker_1.faker.phone.number("#############"),
            password: faker_1.faker.internet.password(15),
        };
        const response = await (0, supertest_1.default)(app_1.default).post("/users").send(userData);
        expect(response.status).toBe(401);
    });
    it("[integration] should be able to get all users", async () => {
        const userData = {
            name: faker_1.faker.name.fullName({
                firstName: "Firstname-",
            }),
            username: faker_1.faker.internet.userName("Username-"),
            email: faker_1.faker.internet.email(),
            phone: faker_1.faker.phone.number("#############"),
            password: faker_1.faker.internet.password(15),
        };
        await userService.store(userData);
        const loginResponse = await (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            email: userData.email,
            password: userData.password,
        });
        const { token } = loginResponse.body;
        const response = await (0, supertest_1.default)(app_1.default)
            .get("/users")
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    it("[integration] should be able to get an user by id", async () => {
        const userData = {
            name: faker_1.faker.name.fullName({
                firstName: "Firstname-",
            }),
            username: faker_1.faker.internet.userName("Username-"),
            email: faker_1.faker.internet.email(),
            phone: faker_1.faker.phone.number("#############"),
            password: faker_1.faker.internet.password(15),
        };
        await userService.store(userData);
        const loginResponse = await (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            email: userData.email,
            password: userData.password,
        });
        const { token } = loginResponse.body;
        const { id } = loginResponse.body.user;
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/users/${id}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.email).toBe(loginResponse.body.user.email);
    });
    it("[integration] should be able to add an user avatar", async () => {
        const userData = {
            name: faker_1.faker.name.fullName({
                firstName: "Firstname-",
            }),
            username: faker_1.faker.internet.userName("Username-"),
            email: faker_1.faker.internet.email(),
            phone: faker_1.faker.phone.number("#############"),
            password: faker_1.faker.internet.password(15),
        };
        await userService.store(userData);
        const loginResponse = await (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            email: userData.email,
            password: userData.password,
        });
        const { token } = loginResponse.body;
        const { id } = loginResponse.body.user;
        const avatarFilePath = (0, path_1.resolve)(`${__dirname}/../assets/mind-consulting.png`);
        const data = fs_1.default.readFileSync(avatarFilePath);
        const convertedData = data.toString("base64");
        const avatarBuffer = Buffer.from(convertedData, "base64");
        const response = await (0, supertest_1.default)(app_1.default)
            .patch(`/users/${id}/avatar`)
            .set("Authorization", `Bearer ${token}`)
            .attach("avatar", avatarBuffer, avatarFilePath);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
    });
    it("[integration] should be able to remove an user avatar", async () => {
        const userData = {
            name: faker_1.faker.name.fullName({
                firstName: "Firstname-",
            }),
            username: faker_1.faker.internet.userName("Username-"),
            email: faker_1.faker.internet.email(),
            phone: faker_1.faker.phone.number("#############"),
            password: faker_1.faker.internet.password(15),
        };
        await userService.store(userData);
        const loginResponse = await (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            email: userData.email,
            password: userData.password,
        });
        const { token } = loginResponse.body;
        const { id } = loginResponse.body.user;
        const avatarFilePath = (0, path_1.resolve)(`${__dirname}/../assets/mind-consulting.png`);
        const data = fs_1.default.readFileSync(avatarFilePath);
        const convertedData = data.toString("base64");
        const avatarBuffer = Buffer.from(convertedData, "base64");
        const addAvatarResponse = await (0, supertest_1.default)(app_1.default)
            .patch(`/users/${id}/avatar`)
            .set("Authorization", `Bearer ${token}`)
            .attach("avatar", avatarBuffer, avatarFilePath);
        expect(addAvatarResponse.status).toBe(200);
        expect(addAvatarResponse.body).toHaveProperty("message");
        const removeAvatarResponse = await (0, supertest_1.default)(app_1.default)
            .patch(`/users/${id}/remove-avatar`)
            .set("Authorization", `Bearer ${token}`);
        expect(removeAvatarResponse.status).toBe(200);
        expect(removeAvatarResponse.body).toHaveProperty("message");
    });
    it("[integration] should be able to update an user", async () => {
        const userData = {
            name: faker_1.faker.name.fullName({
                firstName: "Firstname-",
            }),
            username: faker_1.faker.internet.userName("Username-"),
            email: faker_1.faker.internet.email(),
            phone: faker_1.faker.phone.number("#############"),
            password: faker_1.faker.internet.password(15),
        };
        await userService.store(userData);
        const loginResponse = await (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            email: userData.email,
            password: userData.password,
        });
        const { token } = loginResponse.body;
        const { id } = loginResponse.body.user;
        const updateUserResponse = await (0, supertest_1.default)(app_1.default)
            .put(`/users/${id}`)
            .send({
            name: faker_1.faker.name.fullName(),
            username: faker_1.faker.internet.userName(),
            phone: faker_1.faker.phone.number("#############"),
        })
            .set("Authorization", `Bearer ${token}`);
        expect(updateUserResponse.status).toBe(200);
        expect(updateUserResponse.body).toHaveProperty("message");
    });
    it("[integration] should be able to delete an user", async () => {
        const userData = {
            name: faker_1.faker.name.fullName({
                firstName: "Firstname-",
            }),
            username: faker_1.faker.internet.userName("Username-"),
            email: faker_1.faker.internet.email(),
            phone: faker_1.faker.phone.number("#############"),
            password: faker_1.faker.internet.password(15),
        };
        await userService.store(userData);
        const loginResponse = await (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            email: userData.email,
            password: userData.password,
        });
        const { token } = loginResponse.body;
        const { id } = loginResponse.body.user;
        const deleteUserResponse = await (0, supertest_1.default)(app_1.default)
            .delete(`/users/${id}`)
            .set("Authorization", `Bearer ${token}`);
        expect(deleteUserResponse.status).toBe(200);
        expect(deleteUserResponse.body).toHaveProperty("message");
    });
    afterAll(async () => {
        await database_1.default.$disconnect();
    });
});
//# sourceMappingURL=user.controller.test.js.map