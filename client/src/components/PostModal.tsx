import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
    fetchAllSpotifyPlaylistsByUserId,
    refreshAccessToken,
} from "@/api/routes/spotify";
import {
    isSpotifyTokenExpired,
    updateAccessToken,
} from "@/redux/features/spotify/spotifySlice";
import { isAppleTokenExpired } from "@/redux/features/apple/appleSlice";
import AppleAuthButton from "./apple/AppleAuthButton";
import { fetchAllPlaylistsByMusicUserToken } from "@/api/routes/apple";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { useCreatePostMutation } from "@/redux/api/routes/post";

export default function PostModal({ children }: { children: JSX.Element }) {
    const [playlistOptions, setPlaylistOptions] = useState<
        {
            label: string;
            value: any;
        }[]
    >([]);
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [selectedRadio, setSelectedRadio] = useState("");

    const dispatch = useDispatch();

    const [createPost] = useCreatePostMutation();

    const user = useSelector((state: RootState) => state.userReducer.user);
    const appleToken = useSelector((state: RootState) => state.appleReducer);
    const spotifyToken = useSelector(
        (state: RootState) => state.spotifyReducer
    );

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<PostForm>();

    const handleClose = () => {
        setValue("title", "");
        setValue("description", "");
        setSelectedOption("");
        location.reload();
    };

    const handleSelectOption = (val: string) => {
        setSelectedOption(val);
        setValue("title", playlistOptions[+val].value.name);
        setValue("description", playlistOptions[+val].value.description);
    };

    const handleClearOption = () => {
        setSelectedOption("");
        setValue("title", "");
        setValue("description", "");
    };

    async function populateApplePlaylists() {
        if (appleToken.musicUserToken) {
            const playlists = await fetchAllPlaylistsByMusicUserToken(
                appleToken.musicUserToken
            );
            const formattedPlaylists = playlists.map((playlist: any) => ({
                label: playlist.name,
                value: playlist,
            }));
            handleClearOption();
            setPlaylistOptions(formattedPlaylists);
        }
    }

    async function populateSpotifyPlaylists() {
        if (spotifyToken.accessToken && spotifyToken.spotifyId) {
            const playlists = await fetchAllSpotifyPlaylistsByUserId({
                token: spotifyToken.accessToken,
                spotifyId: spotifyToken.spotifyId,
            });
            const formattedPlaylists = playlists.map((playlist: any) => ({
                label: playlist.name,
                value: playlist,
            }));
            handleClearOption();
            setPlaylistOptions(formattedPlaylists);
        }
    }

    const renderPlaylistOptions = playlistOptions.map(
        (option: any, index: number) => {
            return (
                <SelectItem key={index} value={index.toString()}>
                    {option.label}
                </SelectItem>
            );
        }
    );

    const handleAppleSelect = async () => {
        if (selectedRadio != "apple") {
            setSelectedRadio("apple");
            await populateApplePlaylists();
        }
    };

    const handleSpotifySelect = async () => {
        if (selectedRadio != "spotify") {
            setSelectedRadio("spotify");
            await populateSpotifyPlaylists();
        }
    };

    const ensureValidSpotifyToken = async () => {
        if (isSpotifyTokenExpired(spotifyToken) && spotifyToken.refreshToken) {
            const data = await refreshAccessToken(spotifyToken.refreshToken);
            dispatch(
                updateAccessToken({
                    accessToken: data.accessToken,
                    expirationTime: data.expirationTime,
                    refreshToken: data.refreshToken,
                })
            );
        }
    };

    const handlePost = async (data: PostForm) => {
        if (user && selectedOption) {
            try {
                await createPost({
                    title: data.title,
                    description: data.description,
                    origin: selectedRadio,
                    originId: playlistOptions[+selectedOption].value.id,
                    authorId: user.id,
                }).unwrap();
                handleClose();
            } catch (error) {
                console.error("Failed to create post", error);
                return;
            }
        }
    };

    useEffect(() => {
        ensureValidSpotifyToken();
        !isSpotifyTokenExpired(spotifyToken) && handleSpotifySelect();
    }, [spotifyToken, appleToken]);

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="sm:max-w-[425px] min-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Post</DialogTitle>
                        <DialogDescription>
                            Select a playlist of yours to share with the world!
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handlePost)}>
                        <div className="space-y-2">
                            <p className="font-medium">Origin</p>
                            <div>
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => handleSpotifySelect()}
                                        className="flex p-3 block w-full hover:bg-silver border-2 rounded-lg text-sm focus:ring-1 focus:border-primary focus:ring-primary"
                                        disabled={isSpotifyTokenExpired(
                                            spotifyToken
                                        )}
                                    >
                                        <div className="flex flex-col items-start">
                                            <p className="text-sm">Spotify</p>
                                        </div>
                                        <input
                                            type="radio"
                                            name="radio-post-origin"
                                            className="accent-primary shrink-0 ms-auto mt-0.5 border-silver rounded-full text-primary disabled:opacity-50 disabled:pointer-events-none"
                                            checked={
                                                selectedRadio === "spotify"
                                            }
                                            readOnly
                                            disabled={isSpotifyTokenExpired(
                                                spotifyToken
                                            )}
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleAppleSelect()}
                                        className="flex p-3 block w-full hover:bg-silver border-2 rounded-lg text-sm focus:ring-1 focus:border-primary focus:ring-primary"
                                        disabled={isAppleTokenExpired(
                                            appleToken
                                        )}
                                    >
                                        <p className="text-sm">Apple Music</p>

                                        <input
                                            type="radio"
                                            name="radio-post-origin"
                                            className="accent-primary shrink-0 ms-auto mt-0.5 border-silver rounded-full text-primary disabled:opacity-50 disabled:pointer-events-none"
                                            checked={selectedRadio === "apple"}
                                            readOnly
                                            disabled={isAppleTokenExpired(
                                                appleToken
                                            )}
                                        />
                                    </button>
                                </div>
                                <div className="flex space-x-2">
                                    <div className="w-1/2">
                                        {isSpotifyTokenExpired(spotifyToken) ? (
                                            <Button
                                                type="button"
                                                variant="link"
                                                className="underline text-xs text-silver"
                                                onClick={() => {
                                                    window.location.href = `${
                                                        import.meta.env
                                                            .VITE_SERVER_URL
                                                    }/spotify/auth`;
                                                }}
                                            >
                                                Connect to Spotify
                                            </Button>
                                        ) : null}
                                    </div>
                                    <div className="w-1/2">
                                        <AppleAuthButton />
                                    </div>
                                </div>
                            </div>

                            <p className="font-medium">Details</p>

                            <Select
                                onValueChange={handleSelectOption}
                                value={selectedOption}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Origin Playlist" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {renderPlaylistOptions}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <div className="space-y-1">
                                <Input
                                    type="text"
                                    placeholder="Title"
                                    {...register("title", {
                                        required: "Title is required",
                                        minLength: 2,
                                    })}
                                />
                                {errors.title && (
                                    <p className="text-red-1 text-xs">
                                        {errors.title.message as string}
                                    </p>
                                )}
                            </div>

                            <Textarea
                                rows={5}
                                placeholder="Description"
                                {...register("description", {})}
                            />
                            <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
