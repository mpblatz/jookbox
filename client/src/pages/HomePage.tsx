import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";

import {
    useGetAllPostsQuery,
    useGetFollowerPostsQuery,
} from "@/redux/api/routes/post";
import { RootState } from "@/redux/store";
import PostFeed from "../components/PostFeed";
import StyledNavLink from "@/components/StyledNavLink";
import FeedSkeleton from "@/components/skeletons/FeedSkeleton";

export default function HomePage() {
    const location = useLocation();
    const currentUser = useSelector(
        (state: RootState) => state.userReducer.user
    );

    const {
        data: allPosts,
        isLoading: isLoadingAllPosts,
        error: allPostsError,
    } = useGetAllPostsQuery();

    const {
        data: followerPosts,
        isLoading: isLoadingFollowerPosts,
        error: followerPostsError,
    } = useGetFollowerPostsQuery(currentUser?.id ?? skipToken);

    const emptyMessage = location.pathname.includes("/following")
        ? "Follow other accounts to populate this feed."
        : "It looks like no one has ever posted. Be the first to post!";

    const postsToShow = location.pathname.includes("/following")
        ? followerPosts
        : allPosts;

    const isLoading = location.pathname.includes("/following")
        ? isLoadingFollowerPosts
        : isLoadingAllPosts;

    const error = location.pathname.includes("/following")
        ? followerPostsError
        : allPostsError;

    if (error) return <div>Error fetching posts</div>;
    if (isLoading) return <FeedSkeleton />;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", gap: "16px" }}>
                <StyledNavLink
                    to="/feed"
                    label="For You"
                    pendingClasses=""
                    activeClasses="border-b-2"
                    style={{ borderColor: "var(--accent)" }}
                    end
                />
                <StyledNavLink
                    to="/feed/following"
                    label="Following"
                    pendingClasses=""
                    activeClasses="border-b-2"
                    style={{ borderColor: "var(--accent)" }}
                />
            </div>
            <PostFeed posts={postsToShow ?? []} emptyMessage={emptyMessage} />
        </div>
    );
}
