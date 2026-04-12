import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SettingsModal from "../SettingsModal";
import modpfp from "@/assets/pfp-marsh.png";
import pfp from "@/assets/pfp.png";
import {
    useCreateFollowMutation,
    useDeleteFollowMutation,
} from "@/redux/api/routes/follow";

const btnStyle: React.CSSProperties = {
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 500,
    transition: "all 0.2s ease",
};

export default function Header({
    user,
    isCurrentUser,
}: {
    user: User;
    isCurrentUser: boolean;
}) {
    const { enqueueSnackbar } = useSnackbar();
    const [isFollowing, setIsFollowing] = useState(true);
    const [createFollow] = useCreateFollowMutation();
    const [deleteFollow] = useDeleteFollowMutation();
    const currentUser = useSelector(
        (state: RootState) => state.userReducer.user
    );

    useEffect(() => {
        setIsFollowing(
            user.following?.some(
                (follower) =>
                    currentUser &&
                    follower.followerId === currentUser.id &&
                    follower.followingId === user.id
            ) || false
        );
    }, [user, currentUser]);

    const handleFollow = async () => {
        if (currentUser) {
            await createFollow({
                followerId: currentUser.id,
                followingId: user.id,
            }).unwrap();
            setIsFollowing(true);
        } else {
            enqueueSnackbar("You must be logged in to follow users.", {
                autoHideDuration: 2000,
            });
        }
    };

    const handleUnfollow = async () => {
        if (currentUser) {
            await deleteFollow({
                followerId: currentUser.id,
                followingId: user.id,
            }).unwrap();
            setIsFollowing(false);
        }
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 0 16px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                    }}
                >
                    <img
                        style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            background: "var(--accent)",
                        }}
                        src={user.displayName === "marsh" ? modpfp : pfp}
                    />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                        }}
                    >
                        <h3>{user?.displayName}</h3>
                        <div>
                            {isCurrentUser ? (
                                <SettingsModal user={user}>
                                    <button
                                        style={{
                                            ...btnStyle,
                                            background: "var(--btn-bg)",
                                            border: "1px solid var(--btn-border)",
                                            color: "var(--text)",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.borderColor =
                                                "var(--btn-hover-border)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.borderColor =
                                                "var(--btn-border)")
                                        }
                                    >
                                        Settings
                                    </button>
                                </SettingsModal>
                            ) : isFollowing ? (
                                <button
                                    onClick={() => handleUnfollow()}
                                    style={{
                                        ...btnStyle,
                                        background: "var(--btn-bg)",
                                        border: "1px solid var(--btn-border)",
                                        color: "var(--text)",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.borderColor =
                                            "var(--btn-hover-border)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.borderColor =
                                            "var(--btn-border)")
                                    }
                                >
                                    Unfollow
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleFollow()}
                                    style={{
                                        ...btnStyle,
                                        background: "var(--accent)",
                                        border: "none",
                                        color: "#fff",
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
                                    Follow
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "16px" }}>
                    {[
                        { label: "Posts", value: user.posts?.length || 0 },
                        { label: "Saves", value: user.saves },
                        { label: "Followers", value: user.following?.length || 0 },
                        { label: "Following", value: user.followers?.length || 0 },
                    ].map((stat, i) => (
                        <div
                            key={stat.label}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                            }}
                        >
                            {i > 0 && (
                                <div
                                    style={{
                                        width: "1px",
                                        height: "40px",
                                        background: "var(--divider)",
                                    }}
                                />
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <h3>{stat.value}</h3>
                                <p
                                    style={{
                                        fontSize: "14px",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ borderTop: "1px solid var(--divider)" }} />
        </div>
    );
}
