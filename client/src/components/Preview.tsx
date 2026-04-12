import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Preview({
    source,
    path,
}: {
    source: Post | Playlist;
    path: string;
}) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [marginLeft, setMarginLeft] = useState("");
    const navigate = useNavigate();

    const imageSideLength = 112;
    const numSongsShown = 7;

    useEffect(() => {
        const calculateAndSetImageStyles = () => {
            if (buttonRef.current) {
                const buttonWidth = buttonRef.current.offsetWidth;
                const overlapMargin =
                    imageSideLength -
                    (buttonWidth - imageSideLength) / (numSongsShown - 1);
                setMarginLeft(`-${overlapMargin}px`);
            }
        };

        calculateAndSetImageStyles();

        window.addEventListener("resize", calculateAndSetImageStyles);

        return () =>
            window.removeEventListener("resize", calculateAndSetImageStyles);
    }, [source.songs.length]);

    return (
        <button
            ref={buttonRef}
            onClick={() => navigate(path)}
            style={{
                display: "flex",
                overflow: "hidden",
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                borderRadius: "8px",
            }}
        >
            {Array.from({ length: 7 }).map((_, index) => {
                const song = source.songs[index];
                const zIndex = 1000 - index;
                const isOverlappingImage = index > 0;

                if (song) {
                    return (
                        <img
                            key={index}
                            src={song.imageUrl}
                            alt={`Cover ${index}`}
                            style={{
                                zIndex,
                                marginLeft: isOverlappingImage
                                    ? marginLeft
                                    : "0px",
                                height: `${imageSideLength}px`,
                                boxShadow: "var(--shadow)",
                            }}
                        />
                    );
                } else {
                    return (
                        <div
                            key={`placeholder-${index}`}
                            style={{
                                zIndex,
                                marginLeft: isOverlappingImage
                                    ? marginLeft
                                    : "0px",
                                height: `${imageSideLength}px`,
                                width: `${imageSideLength}px`,
                                background: "var(--card-bg)",
                                border: "1px solid var(--border)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        />
                    );
                }
            })}
        </button>
    );
}
