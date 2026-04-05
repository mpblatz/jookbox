import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { findOrCreateUser } from "./user.controller";

export const getSession = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing token" });
    }

    const token = authHeader.split(" ")[1];

    const {
        data: { user: supabaseUser },
        error,
    } = await supabase.auth.getUser(token);

    if (error || !supabaseUser) {
        return res.status(401).json({ error: "Invalid token" });
    }

    const email = supabaseUser.email || "";
    const firstName =
        supabaseUser.user_metadata?.full_name?.split(" ")[0] || "";
    const lastName =
        supabaseUser.user_metadata?.full_name?.split(" ").slice(1).join(" ") ||
        "";
    const username = email.match(/^[^@]*/)?.[0] || "";

    const user = await findOrCreateUser({
        supabaseId: supabaseUser.id,
        email,
        firstName,
        lastName,
        username,
    });

    return res.status(200).json({ user });
};
