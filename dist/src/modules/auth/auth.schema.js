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
exports.resetPasswordSchema = exports.loginSchema = exports.forgotSchema = void 0;
const yup = __importStar(require("yup"));
const forgotSchema = yup.object().shape({
    email: yup
        .string()
        .email("O campo deve ser um e-mail válido.")
        .required("E-mail é um campo obrigatório."),
});
exports.forgotSchema = forgotSchema;
const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email("O campo deve ser um e-mail válido.")
        .required("E-mail é um campo obrigatório."),
    password: yup
        .string()
        .min(8, "A senha deve ter no mínimo 8 caracteres.")
        .max(25, "A senha deve ter no máximo 25 caracteres.")
        .test("password", "A senha deve possuir no mínimo 8 caracteres, uma letra minúscula e uma letra maiúscula.", (value) => {
        if (value) {
            return (value.length >= 8 &&
                /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$!%*#-_?&]{8,}$/.test(value));
        }
        return true;
    }),
});
exports.loginSchema = loginSchema;
const resetPasswordSchema = yup.object().shape({
    token: yup
        .string()
        .required("Token é um campo obrigatório.")
        .min(8, "Token deve ter no mínimo 8 caracteres.")
        .max(8, "Token deve ter no máximo 8 caracteres."),
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
exports.resetPasswordSchema = resetPasswordSchema;
//# sourceMappingURL=auth.schema.js.map