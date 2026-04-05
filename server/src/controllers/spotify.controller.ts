import axios from "axios";
import { Request, Response } from "express";

import { getClientToken } from "../utils/spotifyClientToken";

export const requestSpotifyAuthorization = async (
    req: Request,
    res: Response
) => {
    // const state = randomBytes(16).toString("base64");
    const scope =
        "user-read-private playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private";

    const { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } = process.env;
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_REDIRECT_URI) {
        return res.status(500).send("Server configuration error");
    }

    res.redirect(
        "https://accounts.spotify.com/authorize?" +
            `response_type=code` +
            `&client_id=${encodeURIComponent(SPOTIFY_CLIENT_ID)}` +
            `&scope=${encodeURIComponent(scope)}` +
            `&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}` +
            `&show_dialog=true`
    );
};

export const spotifyCallback = async (req: Request, res: Response) => {
    const { code, error } = req.query;
    const clientCallbackUrl = process.env.SPOTIFY_CLIENT_CALLBACK_URL;
    if (!clientCallbackUrl) {
        return res.status(500).send("Server configuration error");
    }
    if (error) {
        return res.redirect(`${clientCallbackUrl}?error=${error}`);
    }
    return res.redirect(`${clientCallbackUrl}?code=${code}`);
};

export const requestAccessToken = async (req: Request, res: Response) => {
    try {
        const code = req.body.code;
        const {
            SPOTIFY_CLIENT_ID,
            SPOTIFY_CLIENT_SECRET,
            SPOTIFY_REDIRECT_URI,
        } = process.env;
        if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
            return res.status(500).send("Server configuration error");
        }

        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            {
                grant_type: "authorization_code",
                code: code,
                redirect_uri: SPOTIFY_REDIRECT_URI,
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization:
                        "Basic " +
                        Buffer.from(
                            SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
                        ).toString("base64"),
                },
            }
        );
        return res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(400).send("Error retrieving access token");
    }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
        if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
            return res.status(500).send("Server configuration error");
        }

        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            {
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization:
                        "Basic " +
                        Buffer.from(
                            SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
                        ).toString("base64"),
                },
            }
        );
        const {
            access_token,
            expires_in,
            refresh_token: newRefreshToken,
        } = response.data;
        const expirationTime = new Date(
            new Date().getTime() + expires_in * 1000
        );

        return res.status(200).json({
            accessToken: access_token,
            refreshToken: newRefreshToken || refreshToken, // Send back the new refresh token if it exists, otherwise the old one
            expirationTime: expirationTime.toISOString(), // Convert to ISO string for easy handling on the client side
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error refreshing access token");
    }
};

export const getSpotifyUserId = async (req: Request, res: Response) => {
    try {
        const token = req.body.token;
        if (!token) {
            return res.status(400).send("No token provided");
        }

        const userId = await getSpotifyUserIdInternal(token);

        return res.send(userId);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error retrieving Spotify ID");
    }
};

const getSpotifyUserIdInternal = async (accessToken: string) => {
    try {
        const { data } = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return data.id;
    } catch (error) {
        console.error(error);
        throw new Error("Error retrieving Spotify ID");
    }
};

export const getSpotifyPlaylistsByUserId = async (
    req: Request,
    res: Response
) => {
    try {
        const spotifyId = req.params.id;
        const { token } = req.body;
        if (!token || !spotifyId) {
            return res.status(400).send("Token or Spotify ID missing");
        }
        const { data } = await axios.get(
            "https://api.spotify.com/v1/me/playlists",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    limit: 50,
                },
            }
        );

        let authoredPlaylists = [];
        for (let i = 0; i < data.items.length; i++) {
            if (data.items[i]["owner"]["id"] === spotifyId) {
                authoredPlaylists.push(data.items[i]);
            }
        }

        return res.status(200).send(authoredPlaylists);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("Error retrieving user's Spotify playlists");
    }
};

export const getTopSpotifyPlaylists = async (req: Request, res: Response) => {
    try {
        const token = await getClientToken();
        const topPlaylistsData = await axios({
            method: "get",
            url: `https://api.spotify.com/v1/browse/featured-playlists?country=US`,
            headers: { Authorization: `Bearer ${token}` },
        });
        const playlists = topPlaylistsData.data.playlists.items;
        console.log("Playlist Details: ", playlists);
        const result = await Promise.all(
            playlists.map(async (playlist: any) => {
                try {
                    // Use the utility function to fetch playlist details
                    const playlistDetails = await getSpotifyPlaylistData(
                        playlist.id
                    );
                    return {
                        ...playlistDetails,
                        description: playlist.description.replace(
                            /Cover:.*$/,
                            ""
                        ),
                    };
                } catch (error) {
                    console.error(
                        `Error fetching playlist ${playlist.id}: `,
                        error
                    );
                    // Return a placeholder or partial object on error
                    return {
                        id: playlist.id,
                        title: playlist.name,
                        songs: [],
                        description: playlist.description.replace(
                            /Cover:.*$/,
                            ""
                        ),
                        origin: "spotify",
                        author: { displayName: "Spotify" },
                    };
                }
            })
        );
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send(`Error searching with spotify client`);
    }
};

export const getSpotifyPlaylistById = async (req: Request, res: Response) => {
    try {
        const playlistId = req.params.id;
        const playlist = await getSpotifyPlaylistData(playlistId);
        return res.send(playlist);
    } catch (error) {
        return res.status(500).send("Error fetching spotify playlist by id");
    }
};

export const getSpotifyPlaylistByIdInternal = async (playlistId: string) => {
    try {
        const playlist = await getSpotifyPlaylistData(playlistId);
        return playlist;
    } catch (error) {
        console.error(
            "Error in fetching spotify playlist by id internal ",
            error
        );
        throw error;
    }
};

const getSpotifyPlaylistData = async (playlistId: string) => {
    try {
        const token = await getClientToken();
        const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlistId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        const playlistData = response.data;
        const songs = playlistData.tracks.items.map((song: any) => ({
            id: song.track?.id,
            title: song.track?.name,
            artist: song.track?.artists[0].name,
            imageUrl: song.track?.album.images[0]?.url,
        }));

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
    } catch (error) {
        console.error("Error fetching spotify playlist: ", error);
        throw error;
    }
};

export const getIsrcsBySpotifyPlaylistId = async (playlistId: string) => {
    try {
        const token = await getClientToken();
        const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlistId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const playlist = response.data;
        const isrcs: string[] = [];

        if (playlist.tracks && playlist.tracks.items) {
            const tracks = playlist.tracks.items;
            for (const track of tracks) {
                if (
                    track.track &&
                    track.track.external_ids &&
                    track.track.external_ids.isrc
                ) {
                    const isrc = track.track.external_ids.isrc;
                    isrcs.push(isrc);
                }
            }
        }
        return isrcs;
    } catch (error) {
        console.error("Error getting Isrcs: ", error);
        throw error;
    }
};

export const getTrackUrisByIsrcs = async (isrcs: string[]) => {
    try {
        const token = await getClientToken();
        const trackUris: string[] = [];

        for (const isrc of isrcs) {
            const response = await axios.get(
                `https://api.spotify.com/v1/search?q=isrc:${isrc}&type=track`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const searchResults = response.data.tracks.items;
            if (searchResults.length > 0) {
                const trackUri = searchResults[0].uri;
                trackUris.push(trackUri);
            }
        }

        return trackUris;
    } catch (error) {
        console.error("Error getting track URIs from ISRCs: ", error);
        throw error;
    }
};

export const getTrackUrisBySpotifyPlaylistId = async (playlistId: string) => {
    try {
        const token = await getClientToken();
        const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlistId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const playlist = response.data;

        const trackUris = playlist.tracks.items.map((item: any) => {
            return item.track.uri;
        });

        return trackUris;
    } catch (error) {
        console.error("Error getting Track URIs: ", error);
        throw error;
    }
};

export const createSpotifyPlaylist = async ({
    title,
    description,
    ids,
    accessToken,
}: {
    title: string;
    description: string;
    ids: string[];
    accessToken: string;
}) => {
    try {
        const userId = await getSpotifyUserIdInternal(accessToken);
        const playlistResponse = await axios.post(
            `https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                name: title,
                description: description,
            },
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        const playlistId = playlistResponse.data.id;
        await axios.post(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
                uris: ids,
            },
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        return playlistId;
    } catch (error) {
        console.error("Error creating Spotify playlist by ISRCs:", error);
        throw error;
    }
};

export const searchSpotify = async (req: Request, res: Response) => {
    const search = req.body;
    const type = encodeURIComponent(search.types.join());
    try {
        const token = await getClientToken();
        const searchResults = await axios({
            method: "get",
            url: `https://api.spotify.com/v1/search?q=${search.term}&type=${type}&limit=${search.limit}&offset=${search.offset}`,
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = searchResults.data;

        let result: any = {};
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
    } catch (error) {
        console.error(error);
        return res.status(500).send(`Error searching with spotify client`);
    }
};
