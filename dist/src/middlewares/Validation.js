"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Validation {
    validate = (schema) => async (req, res, next) => {
        const { body } = req;
        try {
            await schema.validate(body);
            return next();
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ error });
        }
    };
}
exports.default = Validation;
//# sourceMappingURL=Validation.js.map