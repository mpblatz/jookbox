import { X } from "lucide-react";

export default function Modal({
    open,
    handleClose,
    title,
    children,
}: {
    open: boolean;
    handleClose: () => void;
    title: string;
    children: JSX.Element;
}) {
    return (
        open && (
            <div
                onClick={() => handleClose()}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 1000,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    paddingTop: "10vh",
                    background: "var(--overlay-bg)",
                }}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "14px",
                        padding: "24px",
                        width: "100%",
                        maxWidth: "700px",
                        boxShadow: "var(--shadow-hover)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        maxHeight: "80vh",
                        overflowY: "auto",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <h3>{title}</h3>
                        <button
                            onClick={() => handleClose()}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--text-faint)",
                                padding: "4px",
                                display: "flex",
                                alignItems: "center",
                                borderRadius: "6px",
                                transition: "color 0.2s ease",
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        )
    );
}
