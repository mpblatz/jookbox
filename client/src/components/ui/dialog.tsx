import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function Dialog({
    open,
    onOpenChange,
    children,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onOpenChange(false);
        };
        if (open) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
        <div
            ref={overlayRef}
            onClick={(e) => {
                if (e.target === overlayRef.current) onOpenChange(false);
            }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingTop: "10vh",
                background: "var(--overlay-bg)",
                transition: "opacity 0.2s ease",
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
                    maxWidth: "480px",
                    boxShadow: "var(--shadow-hover)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    position: "relative",
                    maxHeight: "80vh",
                    overflowY: "auto",
                }}
            >
                <button
                    onClick={() => onOpenChange(false)}
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-faint)",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "6px",
                        transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--text)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-faint)")
                    }
                >
                    <X size={16} />
                </button>
                {children}
            </div>
        </div>
    );
}
