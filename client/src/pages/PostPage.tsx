import {
    CircleUserRound,
    Heart,
    MessageCircle,
    RefreshCcwDot,
    X,
    CornerDownRight,
} from "lucide-react";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CommentBox from "@/components/CommentBox";
import { RootState } from "@/redux/store";
import { formatPostTime } from "@/utils/time";
import { useGetPostQuery } from "@/redux/api/routes/post";
import ViewSkeleton from "@/components/skeletons/ViewSkeleton";
import SavePostModal from "@/components/SavePostModal";
import DeletePostModal from "@/components/DeletePostModal";
import {
    useCreateLikeMutation,
    useDeleteLikeMutation,
} from "@/redux/api/routes/like";
import { useDeleteCommentMutation } from "@/redux/api/routes/comment";

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

const ghostBtnStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    color: "var(--text)",
    padding: "6px 12px",
    borderRadius: "8px",
    transition: "background 0.2s ease",
};

export default function PostPage({ showComments = false }) {
    const { id } = useParams();
    if (!id) return <p>Error identifying post</p>;

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const currentUser = useSelector(
        (state: RootState) => state.userReducer.user
    );

    const [deleteComment] = useDeleteCommentMutation();
    const [createLike] = useCreateLikeMutation();
    const [deleteLike] = useDeleteLikeMutation();
    const { data: post, isLoading, isError } = useGetPostQuery(id);

    if (isLoading) return <ViewSkeleton />;
    if (isError || !post) return <div>Error fetching playlist</div>;

    const isCurrentUser = currentUser?.id === post.author.id;

    const handleLike = async () => {
        if (currentUser) {
            await createLike({
                userId: currentUser.id,
                postId: post.id,
            }).unwrap();
        } else {
            enqueueSnackbar("You must be logged in to like a post.", {
                autoHideDuration: 2000,
            });
        }
    };

    const handleUnlike = async () => {
        if (currentUser) {
            await deleteLike({
                userId: currentUser.id,
                postId: post.id,
            }).unwrap();
        }
    };

    const handleDeleteComment = async (id: string) => {
        await deleteComment(id).unwrap();
    };

    const renderSongs = () => {
        if (Object.keys(post?.songs).length === 0) {
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
        } else {
            return (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        marginTop: "16px",
                    }}
                >
                    {post.songs.map((song) => (
                        <div
                            key={song.imageUrl + song.artist + song.title}
                            style={{
                                display: "flex",
                                gap: "16px",
                                alignItems: "center",
                            }}
                        >
                            <img
                                src={song.imageUrl}
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
        }
    };

    const renderComments = () => {
        if (Object.keys(post?.comments).length === 0) {
            return (
                <div
                    style={{
                        height: "100px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p>
                        There's no comments on this post yet. You could be the
                        first!
                    </p>
                </div>
            );
        } else {
            return (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                >
                    {post?.comments.map((comment) => (
                        <div key={comment.id}>
                            <div
                                style={{
                                    borderTop: "1px solid var(--divider)",
                                }}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "8px",
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "8px",
                                            color: "var(--text-muted)",
                                            fontSize: "14px",
                                        }}
                                    >
                                        <p>{comment.author.displayName}</p>
                                        <p>·</p>
                                        <p>
                                            {formatPostTime(comment.createdAt)}
                                        </p>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                        }}
                                    >
                                        <CornerDownRight
                                            size={18}
                                            style={{
                                                color: "var(--text-faint)",
                                            }}
                                        />
                                        <p>{comment.content}</p>
                                    </div>
                                </div>
                                {comment.author.id === currentUser?.id ? (
                                    <button
                                        onClick={() =>
                                            handleDeleteComment(comment.id)
                                        }
                                        style={{
                                            ...ghostBtnStyle,
                                            color: "var(--text-faint)",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background =
                                                "var(--btn-bg)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background =
                                                "none")
                                        }
                                    >
                                        <X size={18} />
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                        {post?.title}
                    </h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                        {post?.description}
                    </p>
                </div>
                <button
                    onClick={() => navigate(`/user/${post?.author.id}`)}
                    style={{
                        ...ghostBtnStyle,
                        flexShrink: 0,
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--btn-bg)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                    }
                >
                    <CircleUserRound size={18} />
                    <p>{post.author.displayName}</p>
                </button>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    padding: "8px 0",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                    }}
                >
                    <button
                        onClick={() => navigate(`/post/${id}`)}
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
                        {post.total} songs
                    </button>
                    {currentUser &&
                    post.likes.find(
                        (like) => like.userId == currentUser.id
                    ) ? (
                        <button
                            onClick={() => handleUnlike()}
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
                            <Heart
                                size={18}
                                fill="var(--accent)"
                                color="var(--accent)"
                            />
                            <span style={{ color: "var(--accent)" }}>
                                {post.likes.length}
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={() => handleLike()}
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
                            <Heart size={18} />
                            <span>{post.likes.length}</span>
                        </button>
                    )}

                    <button
                        onClick={() => navigate(`/post/${id}/comments`)}
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
                        <MessageCircle size={18} />
                        <span>{post.comments.length}</span>
                    </button>

                    <SavePostModal post={post}>
                        <button
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 12px",
                                background: "var(--accent)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontFamily: "'IBM Plex Sans', sans-serif",
                                fontWeight: 600,
                                transition: "background 0.2s ease",
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
                            <RefreshCcwDot size={18} />
                            Save{post.saves > 0 ? ` · ${post.saves}` : ""}
                        </button>
                    </SavePostModal>
                </div>

                {isCurrentUser ? (
                    <DeletePostModal id={id}>
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
                            Delete
                        </button>
                    </DeletePostModal>
                ) : null}
            </div>
            <div style={{ borderTop: "1px solid var(--divider)" }} />

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                }}
            >
                {!showComments ? (
                    renderSongs()
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                        }}
                    >
                        <CommentBox post={post} />
                        <div>{renderComments()}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
