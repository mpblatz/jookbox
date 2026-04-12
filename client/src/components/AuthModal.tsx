import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog } from "./ui/dialog";
import { supabase } from "@/lib/supabase";

export default function AuthModal({ children }: { children: JSX.Element }) {
    const [open, setOpen] = useState(false);

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/callback/auth`,
            },
        });
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
                    Login
                </h3>
                <button
                    onClick={handleGoogleLogin}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        background: "var(--btn-bg)",
                        border: "1px solid var(--btn-border)",
                        borderRadius: "8px",
                        padding: "10px 16px",
                        cursor: "pointer",
                        color: "var(--text)",
                        fontSize: "14px",
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        fontWeight: 500,
                        transition: "border-color 0.2s ease",
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
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Login with Google
                </button>
                <p
                    style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        lineHeight: 1.5,
                    }}
                >
                    By logging in, you agree to Jookbox's{" "}
                    <Link
                        to="/terms-of-service"
                        style={{ textDecoration: "underline" }}
                        onClick={() => setOpen(false)}
                    >
                        terms of service
                    </Link>
                    {" and "}
                    <Link
                        to="/privacy-policy"
                        style={{ textDecoration: "underline" }}
                        onClick={() => setOpen(false)}
                    >
                        privacy policy
                    </Link>
                    .
                </p>
            </Dialog>
        </>
    );
}
