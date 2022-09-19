"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const faker_1 = require("@faker-js/faker");
const database_1 = __importDefault(require("../src/database"));
const user_service_1 = __importDefault(require("../src/modules/user/user.service"));
const app_1 = __importDefault(require("../src/app"));
describe("AuthController", () => {
    let userService;
    beforeAll(async () => {
        userService = new user_service_1.default();
        await database_1.default.$connect();
    });
    it("[integration] should be able to authenticate with valid credentials", async () => {
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
        const response = await (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            email: userData.email,
            password: userData.password,
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        await userService.destroy(response.body.user.id);
    });
    it("[integration] should be able to forget a password", async () => {
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
        const response = await (0, supertest_1.default)(app_1.default).post("/auth/forgot").send({
            email: userData.email,
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
    });
    it("[integration] should be able to reset a password", async () => {
        const userData = {
            name: faker_1.faker.name.fullName({
                firstName: "Firstname-",
            }),
            username: faker_1.faker.internet.userName("Username-"),
            email: faker_1.faker.internet.email(),
            phone: faker_1.faker.phone.number("#############"),
            password: faker_1.faker.internet.password(15),
        };
        const user = await userService.store(userData);
        const forgotPasswordResponse = await (0, supertest_1.default)(app_1.default)
            .post("/auth/forgot")
            .send({
            email: userData.email,
        });
        expect(forgotPasswordResponse.status).toBe(200);
        expect(forgotPasswordResponse.body).toHaveProperty("message");
        const getUserResponse = await userService.findByPk(user.id);
        const resetPasswordResponse = await (0, supertest_1.default)(app_1.default)
            .post("/auth/forgot")
            .send({
            email: userData.email,
            token: getUserResponse?.password_reset_token,
            password: faker_1.faker.internet.password(15),
        });
        expect(resetPasswordResponse.status).toBe(200);
        expect(resetPasswordResponse.body).toHaveProperty("message");
    });
    it("[integration] should be able to get an user by token", async () => {
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
        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toHaveProperty("token");
        const getUserResponse = await (0, supertest_1.default)(app_1.default).get(`/auth/jwt/${token}`).send({
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
        await database_1.default.$disconnect();
    });
});
//# sourceMappingURL=auth.controller.test.js.map