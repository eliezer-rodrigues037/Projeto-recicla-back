"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = require("multer");
const crypto_1 = require("crypto");
const multerConfig = {
    storage: (0, multer_1.diskStorage)({
        destination: (req, file, callback) => {
            callback(null, "./src/tmp/avatars");
        },
        filename: (req, file, callback) => {
            (0, crypto_1.randomBytes)(16, (err, hash) => {
                if (err)
                    callback(err, file.filename);
                const fileName = `${hash.toString("hex")}-${file.originalname
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")}`;
                callback(null, fileName);
            });
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
    fileFilter: (req, file, callback) => {
        const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];
        if (allowedMimes.includes(file.mimetype))
            callback(null, true);
        else
            callback(new Error("Invalid mime type."));
    },
};
exports.default = multerConfig;
//# sourceMappingURL=multerConfig.js.map