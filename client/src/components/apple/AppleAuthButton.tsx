import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAppleDeveloperToken } from "@/api/routes/apple";
import { setApple } from "@/redux/features/apple/appleSlice";
import { RootState } from "@/redux/store";
import { getExpirationTime } from "@/utils/time";

export default function AppleAuthButton() {
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
    return (
        <div>
            {appleToken.musicUserToken &&
            appleToken.expirationTime &&
            appleTokenExpirationTime > now ? null : (
                <button
                    onClick={authorize}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "var(--text-faint)",
                        textDecoration: "underline",
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        padding: 0,
                    }}
                >
                    Connect Apple Music Account
                </button>
            )}
        </div>
    );
}
