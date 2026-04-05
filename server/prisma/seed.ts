import { db } from "../src/utils/db.server";

type User = {
    displayName: string;
    email: string;
    firstName: string;
    lastName: string;
    bio: string;
    searchTerms: string;
    connectedToSpotify: boolean;
    connectedToApple: boolean;
    posts?: Post[];
    comments?: PostComment[];
};

type Post = {
    title: string;
    description: string;
    isrcs: string;
    origin: string;
    searchTerms: string;
    tags: string;
    saves: number;
    likeCount: number;
    author: User;
    comments?: PostComment[];
    likes?: PostLike[];
};

type PostComment = {
    content: string;
    post: Post;
    author: User;
};

type PostLike = {
    post: Post;
    actor: User;
};

type ClientToken = {
    value: string;
};

async function seed() {
    await Promise.all(
        getUsers().map((user) => {
            return db.user.create({
                data: {
                    supabaseId: `seed-${user.displayName}`,
                    displayName: user.displayName,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    bio: user.bio,
                    connectedToSpotify: user.connectedToSpotify,
                    connectedToApple: user.connectedToApple,
                    saves: 0,
                },
            });
        })
    );
}

seed();

function getUsers(): Array<User> {
    return [
        {
            displayName: "marsh",
            email: "marshallpblatz@gmail.com",
            firstName: "marshall",
            lastName: "blatz",
            bio: "Hi, my name is marshall",
            searchTerms: "m ma mar mars marsh",
            connectedToSpotify: false,
            connectedToApple: false,
        },
        {
            displayName: "bmo",
            email: "bmo@gmail.com",
            firstName: "bo",
            lastName: "moctezuma",
            bio: "Hi, my name is bo",
            searchTerms: "b bm bmo",
            connectedToSpotify: false,
            connectedToApple: false,
        },
    ];
}
