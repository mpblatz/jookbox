import { useLocation } from "react-router-dom";
import PlaylistFeed from "@/components/PlaylistFeed";
import StyledNavLink from "@/components/StyledNavLink";
import { useGetTopApplePlaylistsQuery } from "@/redux/api/routes/apple";
import { useGetTopSpotifyPlaylistsQuery } from "@/redux/api/routes/spotify";
import FeedSkeleton from "@/components/skeletons/FeedSkeleton";

export default function DiscoverPage() {
    const location = useLocation();

    const {
        data: spotifyPlaylists,
        isLoading: isLoadingSpotifyPlaylists,
        error: spotifyPlaylistsError,
    } = useGetTopSpotifyPlaylistsQuery();

    const {
        data: applePlaylists,
        isLoading: isLoadingApplePlaylists,
        error: applePlaylistsError,
    } = useGetTopApplePlaylistsQuery();

    const emptyMessage = location.pathname.includes("/spotify")
        ? "No spotify playlists are recommended at this time."
        : "No apple music playlists are recommended at this time.";

    const postsToShow = location.pathname.includes("/spotify")
        ? spotifyPlaylists
        : applePlaylists;

    const isLoading = location.pathname.includes("/spotify")
        ? isLoadingSpotifyPlaylists
        : isLoadingApplePlaylists;

    const error = location.pathname.includes("/spotify")
        ? spotifyPlaylistsError
        : applePlaylistsError;

    if (isLoading) return <FeedSkeleton />;
    if (error) return <div>Error fetching posts</div>;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", gap: "16px" }}>
                <StyledNavLink
                    to="/discover/spotify"
                    label="Top Spotify Playlists"
                    pendingClasses=""
                    activeClasses="border-b-2"
                    style={{ borderColor: "var(--accent)" }}
                />
                <StyledNavLink
                    to="/discover/apple"
                    label="Top Apple Music Playlists"
                    pendingClasses=""
                    activeClasses="border-b-2"
                    style={{ borderColor: "var(--accent)" }}
                />
            </div>

            <PlaylistFeed
                playlists={postsToShow ?? []}
                emptyMessage={emptyMessage}
            />
        </div>
    );
}
