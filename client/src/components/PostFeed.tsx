import { useNavigate } from "react-router-dom";
import { formatPostTime } from "../utils/time";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSnackbar } from "notistack";
import { CircleUserRound, Heart, MessageCircle } from "lucide-react";
import Preview from "./Preview";
import {
    useCreateLikeMutation,
    useDeleteLikeMutation,
} from "@/redux/api/routes/like";

export default function PostFeed({
    posts,
    emptyMessage,
}: {
    posts: Post[];
    emptyMessage: string;
}) {
    const [createLike] = useCreateLikeMutation();
    const [deleteLike] = useDeleteLikeMutation();
    const currentUser = useSelector(
        (state: RootState) => state.userReducer.user
    );
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const isPostLikedByUser = (post: Post) => {
        return (
            currentUser &&
            post.likes.some((like) => like.userId === currentUser.id)
        );
    };

    const handleLike = async (postId: string) => {
        if (currentUser) {
            await createLike({
                userId: currentUser.id,
                postId: postId,
            }).unwrap();
        } else {
            enqueueSnackbar("You must be logged in to like a post.", {
                autoHideDuration: 2000,
            });
        }
    };

    const handleUnlike = async (postId: string) => {
        if (currentUser) {
            await deleteLike({
                userId: currentUser.id,
                postId: postId,
            }).unwrap();
        }
    };

    const renderFeed = () => {
        if (Object.keys(posts).length === 0) {
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
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            style={{
                                display: "flex",
                                gap: "16px",
                                width: "100%",
                                alignItems: "center",
                            }}
                        >
                            <div style={{ width: "55%" }}>
                                <Preview
                                    source={post}
                                    path={`/post/${post.id}`}
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
                                        navigate(`/post/${post.id}`)
                                    }
                                >
                                    <p
                                        style={{
                                            fontSize: "1.25rem",
                                            fontWeight: 700,
                                            color: "var(--text)",
                                        }}
                                    >
                                        {post.title}
                                    </p>
                                </button>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "24px",
                                        alignItems: "center",
                                        color: "var(--text-muted)",
                                        fontSize: "14px",
                                    }}
                                >
                                    <button
                                        style={{
                                            display: "flex",
                                            gap: "4px",
                                            alignItems: "center",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "var(--text-muted)",
                                            fontSize: "14px",
                                            fontFamily:
                                                "'IBM Plex Sans', sans-serif",
                                            padding: 0,
                                        }}
                                        onClick={() =>
                                            navigate(
                                                `/user/${post.author.id}`
                                            )
                                        }
                                    >
                                        <CircleUserRound size={18} />
                                        <span>{post.author.displayName}</span>
                                    </button>
                                    <span>
                                        {post.total} songs
                                    </span>

                                    {isPostLikedByUser(post) ? (
                                        <button
                                            style={{
                                                display: "flex",
                                                gap: "4px",
                                                alignItems: "center",
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                color: "var(--text-muted)",
                                                padding: 0,
                                            }}
                                            onClick={() =>
                                                handleUnlike(post.id)
                                            }
                                        >
                                            <Heart
                                                size={18}
                                                fill="var(--accent)"
                                                color="var(--accent)"
                                            />
                                            <span>{post.likes.length}</span>
                                        </button>
                                    ) : (
                                        <button
                                            style={{
                                                display: "flex",
                                                gap: "4px",
                                                alignItems: "center",
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                color: "var(--text-muted)",
                                                padding: 0,
                                            }}
                                            onClick={() =>
                                                handleLike(post.id)
                                            }
                                        >
                                            <Heart size={18} />
                                            <span>{post.likes.length}</span>
                                        </button>
                                    )}
                                    <button
                                        style={{
                                            display: "flex",
                                            gap: "4px",
                                            alignItems: "center",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "var(--text-muted)",
                                            padding: 0,
                                            width: "fit-content",
                                        }}
                                        onClick={() =>
                                            navigate(
                                                `/post/${post.id}/comments`
                                            )
                                        }
                                    >
                                        <MessageCircle size={18} />
                                        <span>{post.comments.length}</span>
                                    </button>
                                    <span>
                                        {post.createdAt
                                            ? formatPostTime(post.createdAt)
                                            : "*"}
                                    </span>
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
                                    {post.description ?? ""}
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
