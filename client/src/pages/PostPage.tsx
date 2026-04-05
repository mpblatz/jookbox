import {
    CircleUserRound,
    Heart,
    MessageCircle,
    RefreshCcwDot,
    XIcon,
} from "lucide-react";
import { IconCornerDownRight } from "@tabler/icons-react";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CommentBox from "@/components/CommentBox";
import { RootState } from "@/redux/store";
import { formatPostTime } from "@/utils/time";
import { useGetPostQuery } from "@/redux/api/routes/post";
import ViewSkeleton from "@/components/skeletons/ViewSkeleton";
import { Button } from "@/components/ui/button";
import SavePostModal from "@/components/SavePostModal";
import DeletePostModal from "@/components/DeletePostModal";
import {
    useCreateLikeMutation,
    useDeleteLikeMutation,
} from "@/redux/api/routes/like";
import { useDeleteCommentMutation } from "@/redux/api/routes/comment";

export default function PostPage({ showComments = false }) {
    const { id } = useParams();
    if (!id) return <p>Error identifying post</p>;

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const currentUser = useSelector(
        (state: RootState) => state.userReducer.user
    );

    const [deleteComment] = useDeleteCommentMutation();
    const [createLike] = useCreateLikeMutation();
    const [deleteLike] = useDeleteLikeMutation();
    const { data: post, isLoading, isError } = useGetPostQuery(id);

    if (isLoading) return <ViewSkeleton />;
    if (isError || !post) return <div>Error fetching playlist</div>;

    const isCurrentUser = currentUser?.id === post.author.id;

    const handleLike = async () => {
        if (currentUser) {
            await createLike({
                userId: currentUser.id,
                postId: post.id,
            }).unwrap();
        } else {
            enqueueSnackbar("You must be logged in to like a post.", {
                autoHideDuration: 2000,
            });
        }
    };

    const handleUnlike = async () => {
        if (currentUser) {
            await deleteLike({
                userId: currentUser.id,
                postId: post.id,
            }).unwrap();
        }
    };

    const handleDeleteComment = async (id: string) => {
        await deleteComment(id).unwrap();
    };

    const renderSongs = () => {
        if (Object.keys(post?.songs).length === 0) {
            return (
                <div className="h-[300px] flex justify-center items-center">
                    <p>It looks like this playlist is empty.</p>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col space-y-2 mt-4">
                    {post.songs.map((song) => (
                        <div
                            key={song.imageUrl + song.artist + song.title}
                            className="flex flex-row space-x-4 items-center"
                        >
                            <img
                                key={"image" + song.imageUrl}
                                src={song.imageUrl}
                                className="w-12 h-12 rounded"
                            />
                            <div className="flex flex-col">
                                <p className="font-medium">{song.title}</p>
                                <p className="text-silver">{song.artist}</p>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    };

    const renderComments = () => {
        if (Object.keys(post?.comments).length === 0) {
            return (
                <div className="h-[100px] flex justify-center items-center">
                    <p>
                        There's no comments on this post yet. You could be the
                        first!
                    </p>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col space-y-4">
                    {post?.comments.map((comment) => (
                        <div key={comment.id}>
                            <hr />
                            <div className="flex flex-row justify-between w-full items-center p-2">
                                <div>
                                    <div className="flex flex-row space-x-2">
                                        <p>{comment.author.displayName}</p>
                                        <p>●</p>
                                        <p>
                                            {formatPostTime(comment.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <IconCornerDownRight />
                                        <p>{comment.content}</p>
                                    </div>
                                </div>
                                {comment.author.id === currentUser?.id ? (
                                    <Button
                                        variant="ghost"
                                        className="w-fit"
                                        onClick={() =>
                                            handleDeleteComment(comment.id)
                                        }
                                    >
                                        <XIcon />
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <>
            <div className="flex flex-col space-y-1">
                <div className="flex flex-row justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold">{post?.title}</h3>
                        <p className="text-silver">{post?.description}</p>
                    </div>
                    <Button
                        variant="ghost"
                        className="flex items-center space-x-1 shrink-0"
                        onClick={() => navigate(`/user/${post?.author.id}`)}
                    >
                        <CircleUserRound size={18} />
                        <p>{post.author.displayName}</p>
                    </Button>
                </div>
                <div className="flex flex-row justify-between items-end py-2">
                    <div className="flex flex-row items-center space-x-1">
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/post/${id}`)}
                        >
                            <p>{post.total} songs</p>
                        </Button>
                        {currentUser &&
                        post.likes.find(
                            (like) => like.userId == currentUser.id
                        ) ? (
                            <Button
                                variant="outline"
                                className="flex space-x-1 items-center"
                                onClick={() => handleUnlike()}
                            >
                                <Heart
                                    size={18}
                                    className="fill-primary text-primary"
                                />
                                <p className="text-salmon">
                                    {post.likes.length}
                                </p>
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                className="flex space-x-1 items-center"
                                onClick={() => handleLike()}
                            >
                                <Heart size={18} />
                                <p>{post.likes.length}</p>
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            className="flex space-x-1 items-center"
                            onClick={() => navigate(`/post/${id}/comments`)}
                        >
                            <MessageCircle size={18} />
                            <p>{post.comments.length}</p>
                        </Button>

                        <SavePostModal post={post}>
                            <Button className="flex space-x-2 items-center">
                                <div className="flex items-center space-x-1">
                                    <RefreshCcwDot size={18} />
                                    <p>Save{post.saves > 0 ? ` · ${post.saves}` : ""}</p>
                                </div>
                            </Button>
                        </SavePostModal>
                    </div>

                    {isCurrentUser ? (
                        <DeletePostModal id={id}>
                            <Button variant="outline">Delete</Button>
                        </DeletePostModal>
                    ) : null}
                </div>
                <hr />

                <div className="flex flex-col space-y-2">
                    {!showComments ? (
                        <>{renderSongs()}</>
                    ) : (
                        <div className="flex flex-col space-y-2">
                            <CommentBox post={post} />
                            <div>{renderComments()}</div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
