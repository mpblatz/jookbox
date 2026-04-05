"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.findOrCreateUser = exports.getUser = exports.createUser = void 0;
const db_server_1 = require("../utils/db.server");
const createUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ supabaseId, firstName, lastName, username, email, }) {
    try {
        const result = yield db_server_1.db.user.create({
            data: {
                supabaseId,
                firstName: firstName,
                lastName: lastName,
                displayName: username,
                email: email,
                bio: "",
                connectedToSpotify: false,
                connectedToApple: false,
                saves: 0,
            },
        });
        return result;
    }
    catch (error) {
        console.error(`Error with creating a user: ${error}`);
        return null;
    }
});
exports.createUser = createUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const result = yield db_server_1.db.user.findFirst({
            where: { id },
            include: {
                followers: true,
                following: true,
                likes: true,
                comments: true,
                posts: true,
            },
        });
        return res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(`Error getting user data`);
    }
});
exports.getUser = getUser;
const findOrCreateUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ supabaseId, firstName, lastName, username, email, }) {
    try {
        const existingUser = yield db_server_1.db.user.findUnique({
            where: {
                supabaseId,
            },
        });
        if (existingUser) {
            return existingUser;
        }
        else {
            const newUser = yield (0, exports.createUser)({
                supabaseId,
                firstName,
                lastName,
                username,
                email,
            });
            return newUser;
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.findOrCreateUser = findOrCreateUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const data = req.body;
    try {
        const updatedUser = yield db_server_1.db.user.update({
            where: { id },
            data: Object.assign({}, data),
        });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        return res.status(500).send("Error updating user");
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const deletedUser = yield db_server_1.db.user.delete({ where: { id } });
        return res.status(200).json(deletedUser);
    }
    catch (error) {
        return res.status(500).send(`Error deleting user: ${error}`);
    }
});
exports.deleteUser = deleteUser;
