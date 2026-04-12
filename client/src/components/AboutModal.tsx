import { useState } from "react";
import { Dialog } from "./ui/dialog";

export default function AboutModal({ children }: { children: JSX.Element }) {
    const [open, setOpen] = useState(false);

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
                    About
                </h3>
                <p
                    style={{
                        fontSize: "14px",
                        color: "var(--text-muted)",
                        lineHeight: 1.7,
                    }}
                >
                    Jookbox was made to change the way music enthusiasts share
                    and discover playlists across Spotify and Apple Music. It
                    bridges connections within a music-loving community, making
                    it simple to share personal favorites and explore new tunes.
                    <br />
                    <br />
                    Effortlessly save discovered gems to your music account,
                    enriching your personal collection. Jookbox rekindles the joy
                    of mixtapes for the digital era, inviting you to a world
                    where musical discoveries and connections flourish. Explore
                    the future of music sharing with us.
                </p>
            </Dialog>
        </>
    );
}
