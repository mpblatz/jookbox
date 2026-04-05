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
const db_server_1 = require("../src/utils/db.server");
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(getUsers().map((user) => {
            return db_server_1.db.user.create({
                data: {
                    supabaseId: `seed-${user.displayName}`,
                    displayName: user.displayName,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    bio: user.bio,
                    connectedToSpotify: user.connectedToSpotify,
                    connectedToApple: user.connectedToApple,
                    saves: 0,
                },
            });
        }));
    });
}
seed();
function getUsers() {
    return [
        {
            displayName: "marsh",
            email: "marshallpblatz@gmail.com",
            firstName: "marshall",
            lastName: "blatz",
            bio: "Hi, my name is marshall",
            searchTerms: "m ma mar mars marsh",
            connectedToSpotify: false,
            connectedToApple: false,
        },
        {
            displayName: "bmo",
            email: "bmo@gmail.com",
            firstName: "bo",
            lastName: "moctezuma",
            bio: "Hi, my name is bo",
            searchTerms: "b bm bmo",
            connectedToSpotify: false,
            connectedToApple: false,
        },
    ];
}
