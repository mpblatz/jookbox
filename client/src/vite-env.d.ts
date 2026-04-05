/// <reference types="vite/client" />

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
    bio: string;
    connectedToSpotify: boolean;
    connectedToApple: boolean;
    likes?: [];
    comments?: [];
    followers?: Follow[];
    following?: Follow[];
    posts?: [];
    saves: number;
}

interface Follow {
    followerId: string;
    followingId: string;
}

interface Search {
    term: string;
    types: string[];
    limit: number;
    offset: number;
}

interface SearchResultData {
    uri: string;
    type: string;
    title: string;
    name: string;
    imageUrl: string;
    releaseDate: string;
}

interface SearchResult {
    type: string;
    data: SearchResultData[];
}

interface GroupButton {
    label: string;
    value?: any;
    onClick: () => void;
}

interface Playlist {
    id: string;
    title: string;
    description: string;
    songs: Song[];
    origin: string;
    author: User;
    total: number;
    next: string;
}

interface Post extends Playlist {
    saves: number;
    createdAt: string;
    comments: PostComment[];
    likes: Like[];
}

interface Like {
    userId: string;
    postId: string;
}

interface PostComment {
    id: string;
    content: string;
    post: Post;
    author: User;
    createdAt: string;
}

interface Song {
    title: string;
    artist: string;
    imageUrl: string;
}

interface PostForm {
    title: string;
    description: string;
    originId: string;
    origin: string;
    authorId: string;
}

interface ResponseError extends Error {
    response: {
        data: string;
    };
}

interface SelectOption {
    label: string;
    value: any;
}

interface QueryResponse {
    message: string;
}
