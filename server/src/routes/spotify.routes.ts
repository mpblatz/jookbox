import { Router } from "express";
import {
    searchSpotify,
    requestSpotifyAuthorization,
    spotifyCallback,
    requestAccessToken,
    refreshAccessToken,
    getSpotifyUserId,
    getSpotifyPlaylistById,
    getTopSpotifyPlaylists,
    getSpotifyPlaylistsByUserId,
} from "../controllers/spotify.controller";

const spotifyRoutes = Router();

spotifyRoutes.get("/auth", requestSpotifyAuthorization);
spotifyRoutes.get("/callback", spotifyCallback);
spotifyRoutes.post("/token", requestAccessToken);
spotifyRoutes.post("/refresh", refreshAccessToken);

spotifyRoutes.post("/id", getSpotifyUserId);

spotifyRoutes.get("/playlist/:id", getSpotifyPlaylistById);
spotifyRoutes.get("/playlists/top", getTopSpotifyPlaylists);
spotifyRoutes.post("/playlists/user/:id", getSpotifyPlaylistsByUserId);

spotifyRoutes.post("/search", searchSpotify);

export default spotifyRoutes;
