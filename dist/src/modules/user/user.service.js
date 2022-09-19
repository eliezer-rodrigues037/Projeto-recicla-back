"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable prefer-destructuring */
const bcrypt_1 = __importDefault(require("bcrypt"));
const process_1 = require("process");
const fs_1 = require("fs");
const index_1 = __importDefault(require("../../database/index"));
const updateImage = async (avatar, id) => {
    let newAvatar = avatar;
    if (process_1.platform === "win32")
        newAvatar = avatar.split("\\")[3];
    else if (process_1.platform === "linux")
        newAvatar = avatar.split("/")[3];
    const newData = {
        avatar: `${process.env.APP_URL}/avatars/${newAvatar}`,
    };
    const updatedUser = await index_1.default.user.update({
        where: { id },
        data: newData,
    });
    return updatedUser;
};
class UserService {
    async store(data) {
        const saltRounds = 10;
        const salt = bcrypt_1.default.genSaltSync(saltRounds);
        const hashedPassword = bcrypt_1.default.hashSync(data.password, salt);
        const user = await index_1.default.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
        return user;
    }
    async findAndCountAll(page, pageSize, q) {
        const totalUsers = await index_1.default.user.count({
            where: {
                role: {
                    equals: "User",
                },
                OR: [
                    {
                        name: {
                            contains: q,
                        },
                    },
                    {
                        email: {
                            contains: q,
                        },
                    },
                ],
            },
        });
        const users = await index_1.default.user.findMany({
            where: {
                role: {
                    equals: "User",
                },
                OR: [
                    {
                        name: {
                            contains: q,
                        },
                    },
                    {
                        email: {
                            contains: q,
                        },
                    },
                ],
            },
            take: +pageSize || 5,
            skip: +pageSize ? page * pageSize : 0,
            orderBy: {
                created_at: "desc",
            },
        });
        return {
            count: totalUsers,
            rows: users,
            pageSize: +pageSize || 5,
            page: +page || 0,
        };
    }
    async findByPk(id) {
        const user = await index_1.default.user.findUnique({
            where: {
                id,
            },
        });
        return user;
    }
    async findByEmail(email) {
        const user = await index_1.default.user.findUnique({
            where: { email },
        });
        return user;
    }
    async findByUserName(username) {
        const user = await index_1.default.user.findUnique({ where: { username } });
        return user;
    }
    async updateAvatar(id, avatar) {
        const user = await this.findByPk(id);
        const oldAvatarPath = user?.avatar?.split("/avatars/")[1];
        (0, fs_1.unlink)(`./src/tmp/avatars/${oldAvatarPath}`, (e) => {
            if (e)
                console.log(e);
        });
        const updatedUser = updateImage(String(avatar), id);
        return updatedUser;
    }
    async removeAvatar(id) {
        const user = await this.findByPk(id);
        const oldAvatarPath = user?.avatar?.split("/avatars/")[1];
        (0, fs_1.unlink)(`./src/tmp/avatars/${oldAvatarPath}`, (e) => {
            if (e)
                console.log(e);
        });
        await index_1.default.user.update({
            where: { id },
            data: {
                avatar: null,
            },
        });
        return user;
    }
    async updateForgottenPassword(id, data) {
        const user = await this.findByPk(id);
        await index_1.default.user.update({ where: { id }, data });
        return user;
    }
    async update(id, data) {
        const user = await this.findByPk(id);
        if (data.password) {
            const saltRounds = 10;
            const salt = bcrypt_1.default.genSaltSync(saltRounds);
            const hashedPassword = bcrypt_1.default.hashSync(data.password, salt);
            await index_1.default.user.update({
                where: { id },
                data: {
                    ...data,
                    password: hashedPassword,
                },
            });
            return user;
        }
        await index_1.default.user.update({
            where: { id },
            data: {
                ...data,
            },
        });
        return user;
    }
    async destroy(id) {
        const user = await this.findByPk(id);
        if (user) {
            await this.removeAvatar(user.id);
            await index_1.default.user.delete({ where: { id } });
        }
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map