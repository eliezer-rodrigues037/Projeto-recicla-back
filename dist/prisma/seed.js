"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const faker_1 = require("@faker-js/faker");
const database_1 = __importDefault(require("../src/database"));
(async function main() {
    try {
        const generatedPassword = faker_1.faker.internet.password();
        const user = await database_1.default.user.create({
            data: {
                name: "Admin",
                username: "admin",
                email: "templateadmin@email.com",
                role: "Admin",
                password: bcrypt_1.default.hashSync(generatedPassword, 10),
            },
        });
        console.log({ message: "Admin was created with success!", user });
        console.log("Generated password was: ", generatedPassword);
    }
    catch (e) {
        console.log(e);
        process.exit(1);
    }
    finally {
        await database_1.default.$disconnect();
    }
})();
//# sourceMappingURL=seed.js.map