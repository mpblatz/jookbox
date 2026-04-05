// client/src/api/axios.ts
import axios from "axios";
import { supabase } from "@/lib/supabase";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:3300/api",
});

axiosInstance.interceptors.request.use(async (config) => {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
});

export default axiosInstance;
