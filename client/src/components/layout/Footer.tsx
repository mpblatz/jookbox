import "remixicon/fonts/remixicon.css";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router-dom";

export default function Footer() {
    const navigate = useNavigate();

    return (
        <div className="">
            <Separator />
            <div className="flex flex-row justify-center items-center mt-2 space-x-4">
                <p className="text-sm">
                    Made by{" "}
                    <a href="https://mblatz.com" className="hover:underline">
                        Marshall
                    </a>
                </p>
                <p>●</p>
                <button
                    className="w-fit p-0 text-sm text-white font-normal hover:underline"
                    onClick={() => navigate("/privacy-policy")}
                >
                    Privacy
                </button>
                <button
                    className="w-fit p-0 text-sm text-white font-normal hover:underline"
                    onClick={() => navigate("/terms-of-service")}
                >
                    Terms
                </button>
            </div>
        </div>
    );
}
