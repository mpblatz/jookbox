import { useNavigate } from "react-router-dom";

export default function Footer() {
    const navigate = useNavigate();

    const linkStyle: React.CSSProperties = {
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "11px",
        fontFamily: "'JetBrains Mono', monospace",
        color: "var(--text-very-faint)",
        padding: 0,
        transition: "color 0.2s ease",
    };

    return (
        <div>
            <div style={{ borderTop: "1px solid var(--divider)" }} />
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "16px",
                    paddingTop: "12px",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "var(--text-very-faint)",
                }}
            >
                <p className="text-[11px]">
                    Made by{" "}
                    <a
                        href="https://mblatz.com"
                        style={{
                            color: "var(--text-very-faint)",
                            textDecoration: "none",
                            transition: "color 0.2s ease",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "var(--text-faint)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.color =
                                "var(--text-very-faint)")
                        }
                    >
                        Marshall
                    </a>
                </p>
                <span>·</span>
                <button
                    style={linkStyle}
                    onClick={() => navigate("/privacy-policy")}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--text-faint)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-very-faint)")
                    }
                >
                    Privacy
                </button>
                <button
                    style={linkStyle}
                    onClick={() => navigate("/terms-of-service")}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--text-faint)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-very-faint)")
                    }
                >
                    Terms
                </button>
            </div>
        </div>
    );
}
