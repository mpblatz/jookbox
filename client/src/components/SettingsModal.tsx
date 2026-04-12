import { useDispatch, useSelector } from "react-redux";
import AppleAuthToggle from "./apple/AppleAuthToggle";
import { Dialog } from "./ui/dialog";
import { RootState } from "@/redux/store";
import { clearUser, setUser } from "@/redux/features/user/userSlice";
import { clearSpotify } from "@/redux/features/spotify/spotifySlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    useDeleteUserMutation,
    useUpdateUserMutation,
} from "@/redux/api/routes/user";
import { enqueueSnackbar } from "notistack";

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

export default function SettingsModal({
    user,
    children,
}: {
    user: User;
    children: JSX.Element;
}) {
    const [open, setOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    const [displayName, setDisplayName] = useState<string>("");

    const spotifyToken = useSelector(
        (state: RootState) => state.spotifyReducer
    );
    const currentUser = useSelector(
        (state: RootState) => state.userReducer.user
    );

    const handleChangeUsername = async () => {
        try {
            await updateUser({
                id: user.id,
                displayName: displayName,
            }).unwrap();
            dispatch(setUser({ ...currentUser, displayName: displayName }));
            enqueueSnackbar({
                message: `Successfully changed username to "${displayName}"`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteUser(user.id).unwrap();
            dispatch(clearUser());
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setDisplayName(user.displayName);
    }, [user]);

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
                    Settings
                </h3>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                >
                    <div>
                        <p style={{ fontWeight: 500 }}>
                            {user.firstName} {user.lastName}
                        </p>
                        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                            {user.email}
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                        }}
                    >
                        <label
                            style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                fontFamily: "'JetBrains Mono', monospace",
                                color: "var(--text)",
                            }}
                        >
                            Username
                        </label>
                        <div
                            style={{
                                display: "flex",
                                gap: "8px",
                            }}
                        >
                            <input
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                style={inputStyle}
                                onFocus={(e) =>
                                    (e.currentTarget.style.borderColor =
                                        "var(--accent)")
                                }
                                onBlur={(e) =>
                                    (e.currentTarget.style.borderColor =
                                        "var(--border)")
                                }
                            />
                            <button
                                onClick={() => handleChangeUsername()}
                                style={{
                                    ...btnStyle,
                                    background: "var(--btn-bg)",
                                    color: "var(--text)",
                                    whiteSpace: "nowrap",
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
                                Change
                            </button>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                        }}
                    >
                        {spotifyToken.refreshToken ? (
                            <button
                                style={{
                                    ...btnStyle,
                                    width: "100%",
                                    background: "var(--btn-bg)",
                                    color: "var(--text)",
                                }}
                                onClick={() => dispatch(clearSpotify())}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.borderColor =
                                        "var(--btn-hover-border)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.borderColor =
                                        "var(--btn-border)")
                                }
                            >
                                Disconnect Spotify Account
                            </button>
                        ) : (
                            <button
                                style={{
                                    ...btnStyle,
                                    width: "100%",
                                    background: "var(--btn-bg)",
                                    color: "var(--text)",
                                }}
                                onClick={() => {
                                    window.location.href = `${
                                        import.meta.env.VITE_SERVER_URL
                                    }/spotify/auth`;
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
                                Connect Spotify Account
                            </button>
                        )}
                        <AppleAuthToggle />
                    </div>

                    <button
                        onClick={() => setDeleteConfirmOpen(true)}
                        style={{
                            ...btnStyle,
                            width: "100%",
                            background: "var(--destructive)",
                            color: "#fff",
                            border: "none",
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
                        Delete Account
                    </button>
                </div>
            </Dialog>

            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <h3
                    style={{
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                >
                    Delete Account
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                    Are you sure you want to delete your account? All data will
                    be gone for good.
                </p>
                <button
                    onClick={() => handleDeleteAccount()}
                    style={{
                        ...btnStyle,
                        width: "100%",
                        background: "var(--destructive)",
                        color: "#fff",
                        border: "none",
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
                    Delete
                </button>
            </Dialog>
        </>
    );
}
