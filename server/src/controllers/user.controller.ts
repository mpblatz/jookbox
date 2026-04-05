import { Request, Response } from "express";

import { db } from "../utils/db.server";

export const createUser = async ({
    supabaseId,
    firstName,
    lastName,
    username,
    email,
}: {
    supabaseId: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
}) => {
    try {
        const result = await db.user.create({
            data: {
                supabaseId,
                firstName: firstName,
                lastName: lastName,
                displayName: username,
                email: email,
                bio: "",
                connectedToSpotify: false,
                connectedToApple: false,
                saves: 0,
            },
        });
        return result;
    } catch (error) {
        console.error(`Error with creating a user: ${error}`);
        return null;
    }
};

export const getUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const result = await db.user.findFirst({
            where: { id },
            include: {
                followers: true,
                following: true,
                likes: true,
                comments: true,
                posts: true,
            },
        });
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send(`Error getting user data`);
    }
};

export const findOrCreateUser = async ({
    supabaseId,
    firstName,
    lastName,
    username,
    email,
}: {
    supabaseId: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
}) => {
    try {
        const existingUser = await db.user.findUnique({
            where: {
                supabaseId,
            },
        });

        if (existingUser) {
            return existingUser;
        } else {
            const newUser = await createUser({
                supabaseId,
                firstName,
                lastName,
                username,
                email,
            });
            return newUser;
        }
    } catch (error) {
        console.error(error);
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;
    try {
        const updatedUser = await db.user.update({
            where: { id },
            data: { ...data },
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).send("Error updating user");
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const deletedUser = await db.user.delete({ where: { id } });
        return res.status(200).json(deletedUser);
    } catch (error) {
        return res.status(500).send(`Error deleting user: ${error}`);
    }
};
