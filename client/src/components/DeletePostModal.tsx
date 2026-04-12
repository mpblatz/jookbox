import { useState } from "react";
import { useDeletePostMutation } from "@/redux/api/routes/post";
import { Dialog } from "./ui/dialog";
import { useNavigate } from "react-router-dom";

export default function DeletePostModal({
    id,
    children,
}: {
    id: string;
    children: JSX.Element;
}) {
    const [open, setOpen] = useState(false);
    const [deletePost] = useDeletePostMutation();
    const navigate = useNavigate();

    const handleDeletePost = async () => {
        await deletePost(id).unwrap();
        navigate("/");
    };

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
                    Delete Post
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                    Are you sure you want to delete this post? All data will be
                    gone for good.
                </p>
                <button
                    onClick={() => handleDeletePost()}
                    style={{
                        width: "100%",
                        padding: "10px 16px",
                        background: "var(--destructive)",
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
                            "var(--destructive-hover)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                            "var(--destructive)")
                    }
                >
                    Delete Post
                </button>
            </Dialog>
        </>
    );
}
