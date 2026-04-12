import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAppleDeveloperToken } from "@/api/routes/apple";
import { clearApple, setApple } from "@/redux/features/apple/appleSlice";
import { RootState } from "@/redux/store";
import { getExpirationTime } from "@/utils/time";

const btnStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 16px",
    border: "1px solid var(--btn-border)",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 500,
    background: "var(--btn-bg)",
    color: "var(--text)",
    transition: "border-color 0.2s ease",
};

export default function AppleAuthToggle() {
    const [appleTokenExpirationTime, setAppleTokenExpirationTime] = useState(
        new Date()
    );

    const now = new Date();
    const dispatch = useDispatch();
    const appleToken = useSelector((state: RootState) => state.appleReducer);

    useEffect(() => {
        const loadMusicKit = async () => {
            const developerToken = await getAppleDeveloperToken();
            window.MusicKit.configure({
                developerToken,
                app: {
                    name: "Curate",
                    build: "0.0.1",
                },
            });
        };
        setAppleTokenExpirationTime(
            new Date(appleToken.expirationTime ? appleToken.expirationTime : "")
        );
        loadMusicKit();
    }, [appleToken]);

    const authorize = async () => {
        try {
            const music = window.MusicKit.getInstance();
            const musicUserToken = await music.authorize();
            const expirationSeconds = 90 * 24 * 60 * 60;
            const expirationTime = await getExpirationTime(expirationSeconds);

            dispatch(
                setApple({
                    musicUserToken,
                    expirationTime,
                })
            );
        } catch (error) {
            console.error("Authorization error:", error);
        }
    };

    const unauthorize = async () => {
        const music = window.MusicKit.getInstance();
        await music.unauthorize();
        await dispatch(clearApple());
    };

    return (
        <div>
            {appleToken.musicUserToken &&
            appleToken.expirationTime &&
            appleTokenExpirationTime > now ? (
                <button
                    style={btnStyle}
                    onClick={unauthorize}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor =
                            "var(--btn-hover-border)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor =
                            "var(--btn-border)")
                    }
                >
                    Disconnect Apple Music Account
                </button>
            ) : (
                <button
                    style={btnStyle}
                    onClick={authorize}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor =
                            "var(--btn-hover-border)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor =
                            "var(--btn-border)")
                    }
                >
                    Connect Apple Music Account
                </button>
            )}
        </div>
    );
}
