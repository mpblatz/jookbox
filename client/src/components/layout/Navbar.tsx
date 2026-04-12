import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronDown, Sun, Moon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearUser } from "@/redux/features/user/userSlice";
import { supabase } from "@/lib/supabase";
import PostModal from "../PostModal";
import AuthModal from "../AuthModal";
import AboutModal from "../AboutModal";
import { useTheme } from "../theme-provider";

export default function Navbar() {
    const user = useSelector((state: RootState) => state.userReducer.user);
    const { theme, setTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutWithRedirect = async () => {
        await supabase.auth.signOut();
        dispatch(clearUser());
        navigate("/");
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navBtnStyle: React.CSSProperties = {
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--text)",
        fontSize: "14px",
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontWeight: 500,
        padding: "6px 12px",
        borderRadius: "8px",
        transition: "background 0.2s ease",
    };

    const navBtnHover = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.background = "var(--btn-bg)";
    };
    const navBtnLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.background = "none";
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                }}
            >
                <button
                    onClick={() => navigate("/")}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                    }}
                >
                    <p
                        className="logo-text"
                        style={{
                            fontSize: "2.25rem",
                            color: "var(--text)",
                            marginTop: "-10px",
                        }}
                    >
                        jookbox
                    </p>
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <button
                        onClick={() =>
                            setTheme(theme === "light" ? "dark" : "light")
                        }
                        style={{
                            ...navBtnStyle,
                            padding: "6px",
                            display: "flex",
                            alignItems: "center",
                        }}
                        onMouseEnter={navBtnHover}
                        onMouseLeave={navBtnLeave}
                    >
                        {theme === "light" ? (
                            <Moon size={16} />
                        ) : (
                            <Sun size={16} />
                        )}
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        style={navBtnStyle}
                        onMouseEnter={navBtnHover}
                        onMouseLeave={navBtnLeave}
                    >
                        Home
                    </button>
                    <button
                        onClick={() => navigate("/search")}
                        style={navBtnStyle}
                        onMouseEnter={navBtnHover}
                        onMouseLeave={navBtnLeave}
                    >
                        Search
                    </button>
                    <AboutModal>
                        <button
                            style={navBtnStyle}
                            onMouseEnter={navBtnHover}
                            onMouseLeave={navBtnLeave}
                        >
                            About
                        </button>
                    </AboutModal>
                    {user ? (
                        <>
                            <div
                                ref={menuRef}
                                style={{ position: "relative" }}
                            >
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    style={{
                                        ...navBtnStyle,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                    }}
                                    onMouseEnter={navBtnHover}
                                    onMouseLeave={navBtnLeave}
                                >
                                    {user.displayName}
                                    <ChevronDown
                                        size={14}
                                        style={{
                                            transition: "transform 0.2s ease",
                                            transform: menuOpen
                                                ? "rotate(180deg)"
                                                : "rotate(0deg)",
                                        }}
                                    />
                                </button>
                                {menuOpen && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            right: 0,
                                            marginTop: "4px",
                                            background: "var(--card-bg)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "8px",
                                            padding: "4px",
                                            minWidth: "120px",
                                            boxShadow: "var(--shadow-hover)",
                                            zIndex: 50,
                                        }}
                                    >
                                        <button
                                            onClick={() => {
                                                navigate(`/user/${user?.id}`);
                                                setMenuOpen(false);
                                            }}
                                            style={{
                                                ...navBtnStyle,
                                                width: "100%",
                                                textAlign: "left",
                                            }}
                                            onMouseEnter={navBtnHover}
                                            onMouseLeave={navBtnLeave}
                                        >
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                logoutWithRedirect();
                                                setMenuOpen(false);
                                            }}
                                            style={{
                                                ...navBtnStyle,
                                                width: "100%",
                                                textAlign: "left",
                                            }}
                                            onMouseEnter={navBtnHover}
                                            onMouseLeave={navBtnLeave}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                            <PostModal>
                                <button
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        background: "var(--accent)",
                                        color: "#fff",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        fontFamily: "'IBM Plex Sans', sans-serif",
                                        fontWeight: 600,
                                        padding: "6px 14px",
                                        borderRadius: "8px",
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
                                    <Plus size={16} />
                                    Post
                                </button>
                            </PostModal>
                        </>
                    ) : (
                        <AuthModal>
                            <button
                                style={navBtnStyle}
                                onMouseEnter={navBtnHover}
                                onMouseLeave={navBtnLeave}
                            >
                                Login
                            </button>
                        </AuthModal>
                    )}
                </div>
            </div>
            <div style={{ borderTop: "1px solid var(--divider)" }} />
        </div>
    );
}
