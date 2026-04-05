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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplePlaylist = exports.getSongIdsByApplePlaylistId = exports.getSongIdsByIsrcs = exports.getIsrcsByApplePlaylistId = exports.getApplePlaylistByIdInternal = exports.getTopApplePlaylists = exports.getApplePlaylistById = exports.getApplePlaylistsByUserToken = exports.getAppleDeveloperToken = exports.getAppleDeveloperTokenCached = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
let cachedAppleDeveloperToken = null;
let tokenExpiry = null;
const getAppleDeveloperTokenCached = () => __awaiter(void 0, void 0, void 0, function* () {
    if (cachedAppleDeveloperToken && tokenExpiry && new Date() < tokenExpiry) {
        return cachedAppleDeveloperToken;
    }
    else {
        const newToken = yield generateAppleDeveloperToken();
        cachedAppleDeveloperToken = newToken;
        tokenExpiry = new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000); // 180 days from now
        return newToken;
    }
});
exports.getAppleDeveloperTokenCached = getAppleDeveloperTokenCached;
const generateAppleDeveloperToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const { APPLE_MUSIC_TEAM_ID, APPLE_MUSIC_KEY_ID, APPLE_MUSIC_PRIVATE_KEY_PATH, APPLE_MUSIC_AUTH_SECRET, } = process.env;
    if (!APPLE_MUSIC_TEAM_ID ||
        !APPLE_MUSIC_KEY_ID ||
        !APPLE_MUSIC_PRIVATE_KEY_PATH ||
        !APPLE_MUSIC_AUTH_SECRET) {
        throw new Error("Apple Music environment variables are missing or invalid.");
    }
    try {
        const privateKey = APPLE_MUSIC_AUTH_SECRET.replace(/\\n/g, "\n");
        const token = jsonwebtoken_1.default.sign({}, privateKey, {
            algorithm: "ES256",
            expiresIn: "180d",
            issuer: APPLE_MUSIC_TEAM_ID,
            header: {
                alg: "ES256",
                kid: APPLE_MUSIC_KEY_ID,
            },
        });
        return token;
    }
    catch (error) {
        console.error("Error generating Apple Developer token:", error);
        return null;
    }
});
const getAppleDeveloperToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, exports.getAppleDeveloperTokenCached)();
        return res.status(200).send(token);
    }
    catch (error) {
        console.error("Error generating Apple Developer token:", error);
        res.status(500).send(error);
    }
});
exports.getAppleDeveloperToken = getAppleDeveloperToken;
const getApplePlaylistsByUserToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const musicUserToken = req.header("Music-User-Token");
    if (!musicUserToken) {
        console.error("Music User Token is required");
        return res.status(400).send("Music User Token is required");
    }
    const appleDeveloperToken = yield (0, exports.getAppleDeveloperTokenCached)();
    if (!appleDeveloperToken) {
        throw new Error("Failed to retrieve Apple Developer Token");
    }
    try {
        const response = yield axios_1.default.get("https://api.music.apple.com/v1/me/library/playlists", {
            headers: {
                Authorization: `Bearer ${appleDeveloperToken}`,
                "Music-User-Token": musicUserToken,
            },
        });
        const transformedData = response.data.data
            .filter((playlist) => playlist.attributes.hasCatalog)
            .map((playlist) => ({
            id: playlist.attributes.playParams.globalId,
            name: playlist.attributes.name,
            description: playlist.attributes.description.standard,
        }));
        return res.json(transformedData);
    }
    catch (error) {
        console.error("Error fetching playlists:", error);
        return res.status(500).send("Failed to fetch playlists");
    }
});
exports.getApplePlaylistsByUserToken = getApplePlaylistsByUserToken;
const getApplePlaylistById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const playlist = yield getApplePlaylistDetails(id);
        return res.send(playlist);
    }
    catch (error) {
        return res.status(500).send("Error fetching apple playlist by id");
    }
});
exports.getApplePlaylistById = getApplePlaylistById;
const getTopApplePlaylists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, exports.getAppleDeveloperTokenCached)();
        const playlistResults = yield axios_1.default.get(`https://api.music.apple.com/v1/catalog/us/charts`, {
            params: { limit: 20, types: "playlists" },
            headers: { Authorization: `Bearer ${token}` },
        });
        const playlists = playlistResults.data.results.playlists[0].data;
        const result = yield Promise.all(playlists.map((playlist) => __awaiter(void 0, void 0, void 0, function* () {
            return yield getApplePlaylistDetails(playlist.id);
        })));
        return res.json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(`Error searching with Apple client`);
    }
});
exports.getTopApplePlaylists = getTopApplePlaylists;
const getApplePlaylistByIdInternal = (playlistId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playlistDetails = yield getApplePlaylistDetails(playlistId);
        return playlistDetails;
    }
    catch (error) {
        console.error("Error in fetching apple playlist by id internal ", error);
        throw error;
    }
});
exports.getApplePlaylistByIdInternal = getApplePlaylistByIdInternal;
const getApplePlaylistDetails = (playlistId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const developerToken = yield (0, exports.getAppleDeveloperTokenCached)();
        const response = yield axios_1.default.get(`https://api.music.apple.com/v1/catalog/us/playlists/${playlistId}`, { headers: { Authorization: `Bearer ${developerToken}` } });
        const playlist = response.data.data[0];
        const songs = playlist.relationships.tracks.data.map((song) => ({
            id: song.id,
            title: song.attributes.name,
            artist: song.attributes.artistName,
            imageUrl: song.attributes.artwork.url
                .replace("{w}", "600")
                .replace("{h}", "600")
                .replace("bb.jpg", "bb-60.jpg"),
        }));
        return {
            id: playlist.id,
            title: playlist.attributes.name,
            description: playlist.attributes.description
                ? playlist.attributes.description.short ||
                    playlist.attributes.description.standard
                : "Apple's Top Hits",
            songs: songs,
            origin: "apple",
            author: { displayName: "Apple" },
            total: playlist.relationships.tracks.meta
                ? playlist.relationships.tracks.meta.total
                : songs.length,
        };
    }
    catch (error) {
        console.error("Error getting apple playlist details: ", error);
        throw error;
    }
});
const getIsrcsByApplePlaylistId = (playlistId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const developerToken = yield (0, exports.getAppleDeveloperTokenCached)();
        const response = yield axios_1.default.get(`https://api.music.apple.com/v1/catalog/us/playlists/${playlistId}`, { headers: { Authorization: `Bearer ${developerToken}` } });
        const playlist = response.data.data[0];
        const isrcs = [];
        if (playlist.relationships && playlist.relationships.tracks) {
            const tracks = playlist.relationships.tracks.data;
            for (const track of tracks) {
                const isrc = track.attributes.isrc;
                if (isrc) {
                    isrcs.push(isrc);
                }
            }
        }
        return isrcs;
    }
    catch (error) {
        console.error("Error getting ISRCs from Apple Music playlist: ", error);
        throw error;
    }
});
exports.getIsrcsByApplePlaylistId = getIsrcsByApplePlaylistId;
const getSongIdsByIsrcs = (isrcs) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const developerToken = yield (0, exports.getAppleDeveloperTokenCached)();
        const storefront = "us";
        const songIds = [];
        for (const isrc of isrcs) {
            const response = yield axios_1.default.get(`https://api.music.apple.com/v1/catalog/${storefront}/songs?filter[isrc]=${isrc}`, {
                headers: { Authorization: `Bearer ${developerToken}` },
            });
            const searchResults = response.data.data;
            if (searchResults.length > 0) {
                const songId = searchResults[0].id;
                songIds.push(songId);
            }
        }
        return songIds;
    }
    catch (error) {
        console.error("Error getting catalog songs by ISRCs: ", error);
        throw error;
    }
});
exports.getSongIdsByIsrcs = getSongIdsByIsrcs;
const getSongIdsByApplePlaylistId = (playlistId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const developerToken = yield (0, exports.getAppleDeveloperTokenCached)();
        const response = yield axios_1.default.get(`https://api.music.apple.com/v1/catalog/us/playlists/${playlistId}`, {
            headers: { Authorization: `Bearer ${developerToken}` },
            params: { include: "tracks" }, // Include track data in the response
        });
        const playlist = response.data.data[0];
        const songIds = [];
        if (playlist.relationships && playlist.relationships.tracks) {
            const tracks = playlist.relationships.tracks.data;
            for (const track of tracks) {
                const songId = track.id;
                songIds.push(songId);
            }
        }
        return songIds;
    }
    catch (error) {
        console.error("Error getting song IDs from Apple Music playlist: ", error);
        throw error;
    }
});
exports.getSongIdsByApplePlaylistId = getSongIdsByApplePlaylistId;
const createApplePlaylist = (_a) => __awaiter(void 0, [_a], void 0, function* ({ title, description, ids, musicUserToken, }) {
    try {
        const developerToken = yield (0, exports.getAppleDeveloperTokenCached)();
        const playlistResponse = yield axios_1.default.post(`https://api.music.apple.com/v1/me/library/playlists`, {
            attributes: {
                name: title,
                description: description,
            },
            relationships: {
                tracks: {
                    data: ids.map((id) => ({
                        id: id,
                        type: "songs",
                    })), // Convert ISRCs to track data
                },
            },
        }, {
            headers: {
                Authorization: `Bearer ${developerToken}`,
                "Music-User-Token": musicUserToken,
            },
        });
        const playlistId = playlistResponse.data.data[0].id;
        return playlistId;
    }
    catch (error) {
        console.error("Error creating Apple Music playlist: ", error);
        throw error;
    }
});
exports.createApplePlaylist = createApplePlaylist;
