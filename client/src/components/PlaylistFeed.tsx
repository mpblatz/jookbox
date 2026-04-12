import { useNavigate } from "react-router-dom";
import Preview from "./Preview";

export default function PlaylistFeed({
    playlists,
    emptyMessage,
}: {
    playlists: Playlist[];
    emptyMessage: string;
}) {
    const navigate = useNavigate();
    const renderFeed = () => {
        if (Object.keys(playlists).length === 0) {
            return (
                <div
                    style={{
                        height: "300px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p style={{ color: "var(--text-muted)" }}>{emptyMessage}</p>
                </div>
            );
        } else {
            return (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                    }}
                >
                    {playlists.map((playlist) => (
                        <div
                            key={playlist.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                gap: "16px",
                            }}
                        >
                            <div style={{ width: "55%" }}>
                                <Preview
                                    source={playlist}
                                    path={`/top/${playlist.origin}/${playlist.id}`}
                                />
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "380px",
                                    flexShrink: 0,
                                    alignSelf: "flex-start",
                                    marginTop: "8px",
                                    gap: "4px",
                                }}
                            >
                                <button
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 0,
                                        textAlign: "left",
                                        width: "fit-content",
                                    }}
                                    onClick={() =>
                                        navigate(
                                            `/top/${playlist.origin}/${playlist.id}`
                                        )
                                    }
                                >
                                    <p
                                        style={{
                                            fontSize: "1.25rem",
                                            fontWeight: 700,
                                            color: "var(--text)",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {playlist.title}
                                    </p>
                                </button>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "24px",
                                        color: "var(--text-muted)",
                                        fontSize: "14px",
                                    }}
                                >
                                    <span>
                                        {playlist.author.displayName}
                                    </span>
                                    <span>{playlist.total} songs</span>
                                </div>
                                <p
                                    style={{
                                        color: "var(--text-muted)",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        fontSize: "14px",
                                    }}
                                >
                                    {playlist.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    };
    return <>{renderFeed()}</>;
}
