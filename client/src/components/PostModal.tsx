import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
    fetchAllSpotifyPlaylistsByUserId,
    refreshAccessToken,
} from "@/api/routes/spotify";
import {
    isSpotifyTokenExpired,
    updateAccessToken,
} from "@/redux/features/spotify/spotifySlice";
import { isAppleTokenExpired } from "@/redux/features/apple/appleSlice";
import AppleAuthButton from "./apple/AppleAuthButton";
import { fetchAllPlaylistsByMusicUserToken } from "@/api/routes/apple";
import { Dialog } from "./ui/dialog";
import { ChevronDown } from "lucide-react";
import { useCreatePostMutation } from "@/redux/api/routes/post";

const btnStyle: React.CSSProperties = {
    padding: "10px 16px",
    border: "1px solid var(--btn-border)",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 500,
    transition: "border-color 0.2s ease",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    background: "var(--input-bg)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--text)",
    fontSize: "14px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    outline: "none",
    transition: "border-color 0.2s ease",
};

export default function PostModal({ children }: { children: JSX.Element }) {
    const [open, setOpen] = useState(false);
    const [playlistOptions, setPlaylistOptions] = useState<
        { label: string; value: any }[]
    >([]);
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [selectedRadio, setSelectedRadio] = useState("");
    const [selectOpen, setSelectOpen] = useState(false);

    const dispatch = useDispatch();
    const [createPost] = useCreatePostMutation();

    const user = useSelector((state: RootState) => state.userReducer.user);
    const appleToken = useSelector((state: RootState) => state.appleReducer);
    const spotifyToken = useSelector(
        (state: RootState) => state.spotifyReducer
    );

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<PostForm>();

    const handleClose = () => {
        setValue("title", "");
        setValue("description", "");
        setSelectedOption("");
        location.reload();
    };

    const handleSelectOption = (val: string) => {
        setSelectedOption(val);
        setValue("title", playlistOptions[+val].value.name);
        setValue("description", playlistOptions[+val].value.description);
        setSelectOpen(false);
    };

    const handleClearOption = () => {
        setSelectedOption("");
        setValue("title", "");
        setValue("description", "");
    };

    async function populateApplePlaylists() {
        if (appleToken.musicUserToken) {
            const playlists = await fetchAllPlaylistsByMusicUserToken(
                appleToken.musicUserToken
            );
            const formattedPlaylists = playlists.map((playlist: any) => ({
                label: playlist.name,
                value: playlist,
            }));
            handleClearOption();
            setPlaylistOptions(formattedPlaylists);
        }
    }

    async function populateSpotifyPlaylists() {
        if (spotifyToken.accessToken && spotifyToken.spotifyId) {
            const playlists = await fetchAllSpotifyPlaylistsByUserId({
                token: spotifyToken.accessToken,
                spotifyId: spotifyToken.spotifyId,
            });
            const formattedPlaylists = playlists.map((playlist: any) => ({
                label: playlist.name,
                value: playlist,
            }));
            handleClearOption();
            setPlaylistOptions(formattedPlaylists);
        }
    }

    const handleAppleSelect = async () => {
        if (selectedRadio != "apple") {
            setSelectedRadio("apple");
            await populateApplePlaylists();
        }
    };

    const handleSpotifySelect = async () => {
        if (selectedRadio != "spotify") {
            setSelectedRadio("spotify");
            await populateSpotifyPlaylists();
        }
    };

    const ensureValidSpotifyToken = async () => {
        if (isSpotifyTokenExpired(spotifyToken) && spotifyToken.refreshToken) {
            const data = await refreshAccessToken(spotifyToken.refreshToken);
            dispatch(
                updateAccessToken({
                    accessToken: data.accessToken,
                    expirationTime: data.expirationTime,
                    refreshToken: data.refreshToken,
                })
            );
        }
    };

    const handlePost = async (data: PostForm) => {
        if (user && selectedOption) {
            try {
                await createPost({
                    title: data.title,
                    description: data.description,
                    origin: selectedRadio,
                    originId: playlistOptions[+selectedOption].value.id,
                    authorId: user.id,
                }).unwrap();
                handleClose();
            } catch (error) {
                console.error("Failed to create post", error);
                return;
            }
        }
    };

    useEffect(() => {
        ensureValidSpotifyToken();
        !isSpotifyTokenExpired(spotifyToken) && handleSpotifySelect();
    }, [spotifyToken, appleToken]);

    const radioStyle = (selected: boolean, disabled: boolean): React.CSSProperties => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px",
        width: "100%",
        background: selected ? "var(--btn-bg)" : "transparent",
        border: `1px solid ${selected ? "var(--accent)" : "var(--border)"}`,
        borderRadius: "8px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontSize: "14px",
        fontFamily: "'IBM Plex Sans', sans-serif",
        color: "var(--text)",
        transition: "all 0.2s ease",
    });

    return (
        <>
            <span onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
                {children}
            </span>
            <Dialog open={open} onOpenChange={setOpen}>
                <h3
                    style={{
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                >
                    Post
                </h3>
                <p
                    style={{
                        fontSize: "14px",
                        color: "var(--text-muted)",
                    }}
                >
                    Select a playlist of yours to share with the world!
                </p>
                <form onSubmit={handleSubmit(handlePost)}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                        }}
                    >
                        <p
                            style={{
                                fontWeight: 600,
                                fontSize: "13px",
                                fontFamily: "'JetBrains Mono', monospace",
                            }}
                        >
                            Origin
                        </p>
                        <div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                    type="button"
                                    onClick={() => handleSpotifySelect()}
                                    style={radioStyle(
                                        selectedRadio === "spotify",
                                        isSpotifyTokenExpired(spotifyToken)
                                    )}
                                    disabled={isSpotifyTokenExpired(
                                        spotifyToken
                                    )}
                                >
                                    Spotify
                                    <input
                                        type="radio"
                                        checked={selectedRadio === "spotify"}
                                        readOnly
                                        style={{
                                            accentColor: "var(--accent)",
                                        }}
                                    />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAppleSelect()}
                                    style={radioStyle(
                                        selectedRadio === "apple",
                                        isAppleTokenExpired(appleToken)
                                    )}
                                    disabled={isAppleTokenExpired(appleToken)}
                                >
                                    Apple Music
                                    <input
                                        type="radio"
                                        checked={selectedRadio === "apple"}
                                        readOnly
                                        style={{
                                            accentColor: "var(--accent)",
                                        }}
                                    />
                                </button>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <div style={{ width: "50%" }}>
                                    {isSpotifyTokenExpired(spotifyToken) ? (
                                        <button
                                            type="button"
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "12px",
                                                color: "var(--text-faint)",
                                                textDecoration: "underline",
                                                fontFamily:
                                                    "'IBM Plex Sans', sans-serif",
                                                padding: "4px 0",
                                            }}
                                            onClick={() => {
                                                window.location.href = `${
                                                    import.meta.env
                                                        .VITE_SERVER_URL
                                                }/spotify/auth`;
                                            }}
                                        >
                                            Connect to Spotify
                                        </button>
                                    ) : null}
                                </div>
                                <div style={{ width: "50%" }}>
                                    <AppleAuthButton />
                                </div>
                            </div>
                        </div>

                        <p
                            style={{
                                fontWeight: 600,
                                fontSize: "13px",
                                fontFamily: "'JetBrains Mono', monospace",
                            }}
                        >
                            Details
                        </p>

                        {/* Custom Select */}
                        <div style={{ position: "relative" }}>
                            <button
                                type="button"
                                onClick={() => setSelectOpen(!selectOpen)}
                                style={{
                                    ...inputStyle,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    cursor: "pointer",
                                    textAlign: "left",
                                }}
                            >
                                <span
                                    style={{
                                        color: selectedOption
                                            ? "var(--text)"
                                            : "var(--text-faint)",
                                    }}
                                >
                                    {selectedOption
                                        ? playlistOptions[+selectedOption]
                                              ?.label
                                        : "Origin Playlist"}
                                </span>
                                <ChevronDown
                                    size={14}
                                    style={{
                                        color: "var(--text-faint)",
                                        transition: "transform 0.2s ease",
                                        transform: selectOpen
                                            ? "rotate(180deg)"
                                            : "rotate(0deg)",
                                    }}
                                />
                            </button>
                            {selectOpen && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        right: 0,
                                        marginTop: "4px",
                                        background: "var(--card-bg)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "8px",
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                        zIndex: 50,
                                        boxShadow: "var(--shadow-hover)",
                                    }}
                                >
                                    {playlistOptions.map((option, index) => (
                                        <button
                                            type="button"
                                            key={index}
                                            onClick={() =>
                                                handleSelectOption(
                                                    index.toString()
                                                )
                                            }
                                            style={{
                                                display: "block",
                                                width: "100%",
                                                padding: "8px 12px",
                                                background:
                                                    selectedOption ===
                                                    index.toString()
                                                        ? "var(--btn-bg)"
                                                        : "transparent",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "14px",
                                                fontFamily:
                                                    "'IBM Plex Sans', sans-serif",
                                                color: "var(--text)",
                                                textAlign: "left",
                                                transition:
                                                    "background 0.15s ease",
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.background =
                                                    "var(--btn-bg)")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.background =
                                                    selectedOption ===
                                                    index.toString()
                                                        ? "var(--btn-bg)"
                                                        : "transparent")
                                            }
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Title"
                                style={inputStyle}
                                {...register("title", {
                                    required: "Title is required",
                                    minLength: 2,
                                })}
                                onFocus={(e) =>
                                    (e.currentTarget.style.borderColor =
                                        "var(--accent)")
                                }
                                onBlur={(e) =>
                                    (e.currentTarget.style.borderColor =
                                        "var(--border)")
                                }
                            />
                            {errors.title && (
                                <p
                                    style={{
                                        color: "var(--destructive)",
                                        fontSize: "12px",
                                    }}
                                >
                                    {errors.title.message as string}
                                </p>
                            )}
                        </div>

                        <textarea
                            rows={5}
                            placeholder="Description"
                            style={{
                                ...inputStyle,
                                resize: "vertical",
                                minHeight: "80px",
                            }}
                            {...register("description", {})}
                            onFocus={(e) =>
                                (e.currentTarget.style.borderColor =
                                    "var(--accent)")
                            }
                            onBlur={(e) =>
                                (e.currentTarget.style.borderColor =
                                    "var(--border)")
                            }
                        />

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            <button
                                type="submit"
                                style={{
                                    ...btnStyle,
                                    background: "var(--accent)",
                                    color: "#fff",
                                    border: "none",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                        "var(--accent-hover)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                        "var(--accent)")
                                }
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </form>
            </Dialog>
        </>
    );
}
