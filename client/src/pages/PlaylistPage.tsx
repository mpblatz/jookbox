import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useGetSpotifyPlaylistByIdQuery } from "@/redux/api/routes/spotify";
import { useGetApplePlaylistByIdQuery } from "@/redux/api/routes/apple";
import { skipToken } from "@reduxjs/toolkit/query";
import ViewSkeleton from "@/components/skeletons/ViewSkeleton";
import { CircleUserRound, RefreshCcwDot } from "lucide-react";
import SavePlaylistModal from "@/components/SavePlaylistModal";

const outlineBtnStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    background: "var(--btn-bg)",
    border: "1px solid var(--btn-border)",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    color: "var(--text)",
    transition: "border-color 0.2s ease",
};

export default function PlaylistPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const platform = location.pathname.includes("/spotify/")
        ? "spotify"
        : "apple";

    const spotifyResult = useGetSpotifyPlaylistByIdQuery(
        platform === "spotify" && id ? id : skipToken
    );
    const appleResult = useGetApplePlaylistByIdQuery(
        platform === "apple" && id ? id : skipToken
    );

    const {
        data: playlist,
        isLoading,
        isError,
    } = platform === "spotify" ? spotifyResult : appleResult;

    if (isLoading || !playlist) return <ViewSkeleton />;
    if (isError) return <div>Error fetching playlist</div>;

    const renderSongs = () => {
        if (playlist.songs.length > 0) {
            return (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        marginTop: "16px",
                    }}
                >
                    {playlist.songs.map((song, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                gap: "16px",
                                alignItems: "center",
                            }}
                        >
                            <img
                                src={song.imageUrl}
                                alt=""
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "6px",
                                }}
                            />
                            <div>
                                <p style={{ fontWeight: 500 }}>{song.title}</p>
                                <p
                                    style={{
                                        color: "var(--text-muted)",
                                        fontSize: "14px",
                                    }}
                                >
                                    {song.artist}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else {
            return (
                <div
                    style={{
                        height: "300px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p>It looks like this playlist is empty.</p>
                </div>
            );
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
            }}
        >
            <div>
                <h3>{playlist.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                    {playlist.description}
                </p>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                    }}
                >
                    <SavePlaylistModal playlist={playlist}>
                        <button
                            style={outlineBtnStyle}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.borderColor =
                                    "var(--btn-hover-border)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.borderColor =
                                    "var(--btn-border)")
                            }
                        >
                            <RefreshCcwDot size={18} />
                            Save
                        </button>
                    </SavePlaylistModal>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                        {playlist.total} songs
                    </p>
                </div>
                <button
                    onClick={() =>
                        navigate(
                            `/discover/${playlist.author.displayName.toLowerCase()}`
                        )
                    }
                    style={outlineBtnStyle}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor =
                            "var(--btn-hover-border)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor =
                            "var(--btn-border)")
                    }
                >
                    <CircleUserRound size={18} />
                    {playlist.author.displayName}
                </button>
            </div>
            <div style={{ borderTop: "1px solid var(--divider)" }} />
            {renderSongs()}
        </div>
    );
}
