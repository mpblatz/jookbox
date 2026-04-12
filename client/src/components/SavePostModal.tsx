import { isSpotifyTokenExpired } from "@/redux/features/spotify/spotifySlice";
import AppleAuthButton from "./apple/AppleAuthButton";
import { Dialog } from "./ui/dialog";
import { isAppleTokenExpired } from "@/redux/features/apple/appleSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { savePost } from "@/api/routes/post";
import { useEffect, useState } from "react";
import AuthModal from "./AuthModal";

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

export default function SavePostModal({
    children,
    post,
}: {
    children: JSX.Element;
    post: Post;
}) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState("");

    const currentUser = useSelector(
        (state: RootState) => state.userReducer.user
    );
    const appleToken = useSelector((state: RootState) => state.appleReducer);
    const spotifyToken = useSelector(
        (state: RootState) => state.spotifyReducer
    );

    const handleSave = async () => {
        const postId = post.id;
        const destination = selectedRadio;
        let destinationUserToken = "";

        if (destination === "spotify" && spotifyToken.accessToken) {
            destinationUserToken = spotifyToken.accessToken;
        } else if (destination === "apple" && appleToken.musicUserToken) {
            destinationUserToken = appleToken.musicUserToken;
        }

        try {
            setIsLoading(true);
            await savePost({
                id: postId,
                destination,
                destinationUserToken,
            });
            setIsSuccess(true);
            setIsLoading(false);
        } catch (error) {
            console.error("Error saving post:", error);
        }
    };

    useEffect(() => {
        if (spotifyToken) {
            setSelectedRadio("spotify");
        } else if (appleToken) {
            setSelectedRadio("apple");
        }
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
                    Save Post
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
                                    "{post.title}" has been saved to your{" "}
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
                            You must be logged in to save a post.
                        </p>
                        <AuthModal>
                            <button
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
                                Login to Save
                            </button>
                        </AuthModal>
                    </>
                )}
            </Dialog>
        </>
    );
}
