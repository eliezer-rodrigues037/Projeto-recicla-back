"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const yup = __importStar(require("yup"));
const createUserSchema = yup.object().shape({
    name: yup
        .string()
        .required("Nome é um campo obrigatório.")
        .min(4, "O nome deve possuir no mínimo 4 caracteres.")
        .max(200, "O nome deve possuir no máximo 200 caracteres."),
    username: yup
        .string()
        .required("Nome de usuário é um campo obrigatório.")
        .min(8, "O nome de usuário deve possuir no mínimo 8 caracteres.")
        .max(30, "O nome de usuário deve possuir no máximo 30 caracteres."),
    email: yup
        .string()
        .email("O campo deve ser um e-mail válido.")
        .required("E-mail é um campo obrigatório."),
    phone: yup
        .string()
        .nullable()
        .min(14, "O celular deve possuir no mínimo 14 caracteres.")
        .max(16, "O celular deve possuir no máximo 16 caracteres."),
    role: yup.mixed().notRequired().oneOf(["Admin", "User"]).default("User"),
    password: yup
        .string()
        .required("Senha é um campo obrigatório.")
        .min(8, "A senha deve possuir no mínimo 8 caracteres.")
        .max(25, "A senha deve possuir no máximo 25 caracteres.")
        .test("password", "A senha deve possuir no mínimo 8 caracteres, uma letra minúscula e uma letra maiúscula.", (value) => {
        if (value) {
            return (value.length >= 8 &&
                /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$!%*#-_?&]{8,}$/.test(value));
        }
        return true;
    }),
});
exports.createUserSchema = createUserSchema;
const updateUserSchema = yup.object().shape({
    name: yup
        .string()
        .notRequired()
        .min(4, "O nome deve possuir no mínimo 4 caracteres.")
        .max(200, "O nome deve possuir no máximo 200 caracteres."),
    username: yup
        .string()
        .notRequired()
        .min(8, "O nome de usuário deve possuir no mínimo 8 caracteres.")
        .max(30, "O nome de usuário deve possuir no máximo 30 caracteres."),
    email: yup.string().email("O campo deve ser um e-mail válido.").notRequired(),
    phone: yup
        .string()
        .notRequired()
        .min(14, "O celular deve possuir no mínimo 14 caracteres.")
        .max(16, "O celular deve possuir no máximo 16 caracteres."),
    role: yup.mixed().notRequired().oneOf(["Admin", "User"]),
    password: yup
        .string()
        .notRequired()
        .min(8, "A senha deve possuir no mínimo 8 caracteres.")
        .max(25, "A senha deve possuir no máximo 25 caracteres.")
        .test("password", "A senha deve possuir no mínimo 8 caracteres, uma letra minúscula e uma letra maiúscula.", (value) => {
        if (value) {
            return (value.length >= 8 &&
                /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$!%*#-_?&]{8,}$/.test(value));
        }
        return true;
    }),
});
exports.updateUserSchema = updateUserSchema;
//# sourceMappingURL=user.schema.js.map