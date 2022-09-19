"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const consoleColors_1 = __importDefault(require("./helpers/consoleColors"));
const port = process.env.PORT;
app_1.default.listen(port, () => {
    console.log(consoleColors_1.default.Green, `Server running on: ${process.env.APP_URL}.\n`);
});
//# sourceMappingURL=server.js.map