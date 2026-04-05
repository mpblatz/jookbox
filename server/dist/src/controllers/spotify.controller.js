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
exports.searchSpotify = exports.createSpotifyPlaylist = exports.getTrackUrisBySpotifyPlaylistId = exports.getTrackUrisByIsrcs = exports.getIsrcsBySpotifyPlaylistId = exports.getSpotifyPlaylistByIdInternal = exports.getSpotifyPlaylistById = exports.getTopSpotifyPlaylists = exports.getSpotifyPlaylistsByUserId = exports.getSpotifyUserId = exports.refreshAccessToken = exports.requestAccessToken = exports.spotifyCallback = exports.requestSpotifyAuthorization = void 0;
const axios_1 = __importDefault(require("axios"));
const spotifyClientToken_1 = require("../utils/spotifyClientToken");
const requestSpotifyAuthorization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const state = randomBytes(16).toString("base64");
    const scope = "user-read-private playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private";
    const { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } = process.env;
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_REDIRECT_URI) {
        return res.status(500).send("Server configuration error");
    }
    res.redirect("https://accounts.spotify.com/authorize?" +
        `response_type=code` +
        `&client_id=${encodeURIComponent(SPOTIFY_CLIENT_ID)}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}` +
        `&show_dialog=true`);
});
exports.requestSpotifyAuthorization = requestSpotifyAuthorization;
const spotifyCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, error } = req.query;
    const clientCallbackUrl = process.env.SPOTIFY_CLIENT_CALLBACK_URL;
    if (!clientCallbackUrl) {
        return res.status(500).send("Server configuration error");
    }
    if (error) {
        return res.redirect(`${clientCallbackUrl}?error=${error}`);
    }
    return res.redirect(`${clientCallbackUrl}?code=${code}`);
});
exports.spotifyCallback = spotifyCallback;
const requestAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.body.code;
        const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI, } = process.env;
        if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
            return res.status(500).send("Server configuration error");
        }
        const response = yield axios_1.default.post("https://accounts.spotify.com/api/token", {
            grant_type: "authorization_code",
            code: code,
            redirect_uri: SPOTIFY_REDIRECT_URI,
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " +
                    Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString("base64"),
            },
        });
        return res.json(response.data);
    }
    catch (error) {
        console.error(error);
        res.status(400).send("Error retrieving access token");
    }
});
exports.requestAccessToken = requestAccessToken;
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
        if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
            return res.status(500).send("Server configuration error");
        }
        const response = yield axios_1.default.post("https://accounts.spotify.com/api/token", {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " +
                    Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString("base64"),
            },
        });
        const { access_token, expires_in, refresh_token: newRefreshToken, } = response.data;
        const expirationTime = new Date(new Date().getTime() + expires_in * 1000);
        return res.status(200).json({
            accessToken: access_token,
            refreshToken: newRefreshToken || refreshToken, // Send back the new refresh token if it exists, otherwise the old one
            expirationTime: expirationTime.toISOString(), // Convert to ISO string for easy handling on the client side
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error refreshing access token");
    }
});
exports.refreshAccessToken = refreshAccessToken;
const getSpotifyUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.body.token;
        if (!token) {
            return res.status(400).send("No token provided");
        }
        const userId = yield getSpotifyUserIdInternal(token);
        return res.send(userId);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error retrieving Spotify ID");
    }
});
exports.getSpotifyUserId = getSpotifyUserId;
const getSpotifyUserIdInternal = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return data.id;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error retrieving Spotify ID");
    }
});
const getSpotifyPlaylistsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const spotifyId = req.params.id;
        const { token } = req.body;
        if (!token || !spotifyId) {
            return res.status(400).send("Token or Spotify ID missing");
        }
        const { data } = yield axios_1.default.get("https://api.spotify.com/v1/me/playlists", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                limit: 50,
            },
        });
        let authoredPlaylists = [];
        for (let i = 0; i < data.items.length; i++) {
            if (data.items[i]["owner"]["id"] === spotifyId) {
                authoredPlaylists.push(data.items[i]);
            }
        }
        return res.status(200).send(authoredPlaylists);
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("Error retrieving user's Spotify playlists");
    }
});
exports.getSpotifyPlaylistsByUserId = getSpotifyPlaylistsByUserId;
const getTopSpotifyPlaylists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, spotifyClientToken_1.getClientToken)();
        const topPlaylistsData = yield (0, axios_1.default)({
            method: "get",
            url: `https://api.spotify.com/v1/browse/featured-playlists?country=US`,
            headers: { Authorization: `Bearer ${token}` },
        });
        const playlists = topPlaylistsData.data.playlists.items;
        console.log("Playlist Details: ", playlists);
        const result = yield Promise.all(playlists.map((playlist) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Use the utility function to fetch playlist details
                const playlistDetails = yield getSpotifyPlaylistData(playlist.id);
                return Object.assign(Object.assign({}, playlistDetails), { description: playlist.description.replace(/Cover:.*$/, "") });
            }
            catch (error) {
                console.error(`Error fetching playlist ${playlist.id}: `, error);
                // Return a placeholder or partial object on error
                return {
                    id: playlist.id,
                    title: playlist.name,
                    songs: [],
                    description: playlist.description.replace(/Cover:.*$/, ""),
                    origin: "spotify",
                    author: { displayName: "Spotify" },
                };
            }
        })));
        return res.json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(`Error searching with spotify client`);
    }
});
exports.getTopSpotifyPlaylists = getTopSpotifyPlaylists;
const getSpotifyPlaylistById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playlistId = req.params.id;
        const playlist = yield getSpotifyPlaylistData(playlistId);
        return res.send(playlist);
    }
    catch (error) {
        return res.status(500).send("Error fetching spotify playlist by id");
    }
});
exports.getSpotifyPlaylistById = getSpotifyPlaylistById;
const getSpotifyPlaylistByIdInternal = (playlistId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playlist = yield getSpotifyPlaylistData(playlistId);
        return playlist;
    }
    catch (error) {
        console.error("Error in fetching spotify playlist by id internal ", error);
        throw error;
    }
});
exports.getSpotifyPlaylistByIdInternal = getSpotifyPlaylistByIdInternal;
const getSpotifyPlaylistData = (playlistId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, spotifyClientToken_1.getClientToken)();
        const response = yield axios_1.default.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const playlistData = response.data;
        const songs = playlistData.tracks.items.map((song) => {
            var _a, _b, _c, _d, _e;
            return ({
                id: (_a = song.track) === null || _a === void 0 ? void 0 : _a.id,
                title: (_b = song.track) === null || _b === void 0 ? void 0 : _b.name,
                artist: (_c = song.track) === null || _c === void 0 ? void 0 : _c.artists[0].name,
                imageUrl: (_e = (_d = song.track) === null || _d === void 0 ? void 0 : _d.album.images[0]) === null || _e === void 0 ? void 0 : _e.url,
            });
        });
        return {
            id: playlistData.id,
            title: playlistData.name,
            description: playlistData.description,
            songs: songs,
            origin: "spotify",
            author: { displayName: "Spotify" },
            next: playlistData.tracks.next,
            total: playlistData.tracks.total,
        };
    }
    catch (error) {
        console.error("Error fetching spotify playlist: ", error);
        throw error;
    }
});
const getIsrcsBySpotifyPlaylistId = (playlistId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, spotifyClientToken_1.getClientToken)();
        const response = yield axios_1.default.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const playlist = response.data;
        const isrcs = [];
        if (playlist.tracks && playlist.tracks.items) {
            const tracks = playlist.tracks.items;
            for (const track of tracks) {
                if (track.track &&
                    track.track.external_ids &&
                    track.track.external_ids.isrc) {
                    const isrc = track.track.external_ids.isrc;
                    isrcs.push(isrc);
                }
            }
        }
        return isrcs;
    }
    catch (error) {
        console.error("Error getting Isrcs: ", error);
        throw error;
    }
});
exports.getIsrcsBySpotifyPlaylistId = getIsrcsBySpotifyPlaylistId;
const getTrackUrisByIsrcs = (isrcs) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, spotifyClientToken_1.getClientToken)();
        const trackUris = [];
        for (const isrc of isrcs) {
            const response = yield axios_1.default.get(`https://api.spotify.com/v1/search?q=isrc:${isrc}&type=track`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const searchResults = response.data.tracks.items;
            if (searchResults.length > 0) {
                const trackUri = searchResults[0].uri;
                trackUris.push(trackUri);
            }
        }
        return trackUris;
    }
    catch (error) {
        console.error("Error getting track URIs from ISRCs: ", error);
        throw error;
    }
});
exports.getTrackUrisByIsrcs = getTrackUrisByIsrcs;
const getTrackUrisBySpotifyPlaylistId = (playlistId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, spotifyClientToken_1.getClientToken)();
        const response = yield axios_1.default.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const playlist = response.data;
        const trackUris = playlist.tracks.items.map((item) => {
            return item.track.uri;
        });
        return trackUris;
    }
    catch (error) {
        console.error("Error getting Track URIs: ", error);
        throw error;
    }
});
exports.getTrackUrisBySpotifyPlaylistId = getTrackUrisBySpotifyPlaylistId;
const createSpotifyPlaylist = (_a) => __awaiter(void 0, [_a], void 0, function* ({ title, description, ids, accessToken, }) {
    try {
        const userId = yield getSpotifyUserIdInternal(accessToken);
        const playlistResponse = yield axios_1.default.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            name: title,
            description: description,
        }, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const playlistId = playlistResponse.data.id;
        yield axios_1.default.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            uris: ids,
        }, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return playlistId;
    }
    catch (error) {
        console.error("Error creating Spotify playlist by ISRCs:", error);
        throw error;
    }
});
exports.createSpotifyPlaylist = createSpotifyPlaylist;
const searchSpotify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.body;
    const type = encodeURIComponent(search.types.join());
    try {
        const token = yield (0, spotifyClientToken_1.getClientToken)();
        const searchResults = yield (0, axios_1.default)({
            method: "get",
            url: `https://api.spotify.com/v1/search?q=${search.term}&type=${type}&limit=${search.limit}&offset=${search.offset}`,
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = searchResults.data;
        let result = {};
        for (const itemType in data) {
            const items = data[itemType].items;
            result[itemType] = [];
            for (const item of items) {
                if (itemType === "albums") {
                    result[itemType].push({
                        type: itemType,
                        uri: item.uri,
                        title: item.name,
                        name: item.artists[0].name,
                        imageUrl: item.images[0].url,
                        releaseDate: item.release_date,
                    });
                }
                if (itemType === "tracks") {
                    result[itemType].push({
                        type: itemType,
                        uri: item.uri,
                        title: item.name,
                        name: item.artists[0].name,
                        imageUrl: item.album.images[0].url,
                        releaseDate: item.release_date,
                    });
                }
                if (itemType === "artists") {
                    result[itemType].push({
                        type: itemType,
                        uri: item.uri,
                        title: null,
                        name: item.name,
                        imageUrl: item.images[0] ? item.images[0].url : "",
                        releaseDate: null,
                    });
                }
            }
        }
        return res.status(200).send(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(`Error searching with spotify client`);
    }
});
exports.searchSpotify = searchSpotify;
