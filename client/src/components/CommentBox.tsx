import { useSnackbar } from "notistack";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useCreateCommentMutation } from "@/redux/api/routes/comment";

export default function CommentBox({ post }: { post: Post }) {
    const { enqueueSnackbar } = useSnackbar();
    const [content, setContent] = useState("");
    const [createComment] = useCreateCommentMutation();
    const currentUser = useSelector(
        (state: RootState) => state.userReducer.user
    );

    const handleCreateComment = async () => {
        if (currentUser) {
            await createComment({
                userId: currentUser.id,
                postId: post.id,
                content,
            }).unwrap();
            setContent("");
        } else {
            enqueueSnackbar("You must be logged in to comment on a post.", {
                autoHideDuration: 2000,
            });
        }
    };

    return (
        <div
            style={{
                marginTop: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
            }}
        >
            <textarea
                rows={5}
                placeholder="Add a comment..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text)",
                    fontSize: "14px",
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    outline: "none",
                    resize: "vertical",
                    minHeight: "80px",
                    transition: "border-color 0.2s ease",
                }}
                onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "var(--accent)")
                }
                onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border)")
                }
            />
            <button
                onClick={handleCreateComment}
                style={{
                    alignSelf: "flex-end",
                    padding: "8px 16px",
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
                    (e.currentTarget.style.background = "var(--accent-hover)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--accent)")
                }
            >
                Comment
            </button>
        </div>
    );
}
