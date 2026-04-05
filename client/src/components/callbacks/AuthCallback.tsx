import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/redux/features/user/userSlice";
import { supabase } from "@/lib/supabase";
import axiosInstance from "@/api/axios";

export default function AuthCallback() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                try {
                    const { data } = await axiosInstance.get("/auth/session", {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                        },
                    });
                    dispatch(setUser(data.user));
                } catch (error) {
                    console.error("Failed to fetch user session:", error);
                }
                navigate("/");
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <div className="w-full h-[400px] flex items-center justify-center">
            <p>Redirecting...</p>
        </div>
    );
}
