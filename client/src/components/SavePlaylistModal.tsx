import { isSpotifyTokenExpired } from "@/redux/features/spotify/spotifySlice";
import AppleAuthButton from "./apple/AppleAuthButton";
import { Dialog } from "./ui/dialog";
import { isAppleTokenExpired } from "@/redux/features/apple/appleSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { savePlaylist } from "@/api/routes/playlist";
import { infinity } from "ldrs";
import { supabase } from "@/lib/supabase";

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

export default function SavePlaylistModal({
    children,
    playlist,
}: {
    children: JSX.Element;
    playlist: Playlist;
}) {
    infinity.register();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const currentUser = useSelector(
        (state: RootState) => state.userReducer.user
    );
    const appleToken = useSelector((state: RootState) => state.appleReducer);
    const spotifyToken = useSelector(
        (state: RootState) => state.spotifyReducer
    );

    const [selectedRadio, setSelectedRadio] = useState("");

    const handleSave = async () => {
        const destination = selectedRadio;
        let destinationUserToken = "";

        if (destination === "spotify" && spotifyToken.accessToken) {
            destinationUserToken = spotifyToken.accessToken;
        } else if (destination === "apple" && appleToken.musicUserToken) {
            destinationUserToken = appleToken.musicUserToken;
        }

        try {
            setIsLoading(true);
            await savePlaylist({
                origin: playlist.origin,
                originId: playlist.id,
                title: playlist.title,
                description: playlist.description,
                destination,
                destinationUserToken,
            });
            setIsSuccess(true);
            setIsLoading(false);
        } catch (error) {
            console.error("Error saving playlist:", error);
        }
    };

    useEffect(() => {
        if (spotifyToken) {
            setSelectedRadio("spotify");
        } else if (appleToken) {
            setSelectedRadio("apple");
        }
    }, [spotifyToken, appleToken]);

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/callback/auth`,
            },
        });
    };

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
                    Save Playlist
                </h3>
                {currentUser ? (
                    <>
                        {isSuccess ? (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "14px",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    "{playlist.title}" has been saved to your{" "}
                                    {selectedRadio} account
                                </p>
                                <button
                                    onClick={() => setOpen(false)}
                                    style={{
                                        ...btnStyle,
                                        background: "var(--btn-bg)",
                                        color: "var(--text)",
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        ) : isLoading ? (
                            <div
                                style={{
                                    height: "100px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "var(--text-faint)",
                                    fontSize: "14px",
                                }}
                            >
                                Saving...
                            </div>
                        ) : (
                            <>
                                <p
                                    style={{
                                        fontSize: "14px",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    Select a platform to save this playlist to.
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "8px",
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedRadio("spotify")
                                            }
                                            style={radioStyle(
                                                selectedRadio === "spotify",
                                                isSpotifyTokenExpired(
                                                    spotifyToken
                                                )
                                            )}
                                            disabled={isSpotifyTokenExpired(
                                                spotifyToken
                                            )}
                                        >
                                            Spotify
                                            <input
                                                type="radio"
                                                checked={
                                                    selectedRadio === "spotify"
                                                }
                                                readOnly
                                                style={{
                                                    accentColor: "var(--accent)",
                                                }}
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedRadio("apple")
                                            }
                                            style={radioStyle(
                                                selectedRadio === "apple",
                                                isAppleTokenExpired(appleToken)
                                            )}
                                            disabled={isAppleTokenExpired(
                                                appleToken
                                            )}
                                        >
                                            Apple Music
                                            <input
                                                type="radio"
                                                checked={
                                                    selectedRadio === "apple"
                                                }
                                                readOnly
                                                style={{
                                                    accentColor: "var(--accent)",
                                                }}
                                            />
                                        </button>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "8px",
                                        }}
                                    >
                                        <div style={{ width: "50%" }}>
                                            {isSpotifyTokenExpired(
                                                spotifyToken
                                            ) ? (
                                                <button
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        fontSize: "12px",
                                                        color: "var(--text-faint)",
                                                        textDecoration:
                                                            "underline",
                                                        fontFamily:
                                                            "'IBM Plex Sans', sans-serif",
                                                        padding: 0,
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
                                    <button
                                        onClick={() => handleSave()}
                                        style={{
                                            ...btnStyle,
                                            background: "var(--accent)",
                                            color: "#fff",
                                            border: "none",
                                            width: "100%",
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
                                        Save
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <p
                            style={{
                                fontSize: "14px",
                                color: "var(--text-muted)",
                            }}
                        >
                            You must be logged in to save a playlist.
                        </p>
                        <button
                            onClick={handleGoogleLogin}
                            style={{
                                ...btnStyle,
                                background: "var(--btn-bg)",
                                color: "var(--text)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                width: "100%",
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Login with Google
                        </button>
                    </>
                )}
            </Dialog>
        </>
    );
}
