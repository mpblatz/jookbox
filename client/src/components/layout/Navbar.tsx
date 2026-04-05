import { useNavigate } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearUser } from "@/redux/features/user/userSlice";
import { supabase } from "@/lib/supabase";
import PostModal from "../PostModal";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import AuthModal from "../AuthModal";
import AboutModal from "../AboutModal";

export default function Navbar() {
    const user = useSelector((state: RootState) => state.userReducer.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutWithRedirect = async () => {
        await supabase.auth.signOut();
        dispatch(clearUser());
        navigate("/");
    };

    return (
        <div className="flex flex-col justify-center space-y-2">
            <div className="justify-between flex flex-row items-center py-2 w-full">
                <Button
                    onClick={() => navigate("/")}
                    className="w-[110px]"
                    variant="ghost"
                >
                    <p className="mt-[-10px] logo-text text-4xl"> jookbox</p>
                </Button>
                <div className="flex flex-row items-center space-x-1">
                    <Button onClick={() => navigate("/")} variant="ghost">
                        Home
                    </Button>
                    <Button onClick={() => navigate("/search")} variant="ghost">
                        Search
                    </Button>
                    <AboutModal>
                        <Button variant="ghost">About</Button>
                    </AboutModal>
                    {user ? (
                        <>
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger>
                                            {user.displayName}
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <div className="flex flex-col items-start bg-b-secondary drop-shadow dark:bg-db-secondary rounded-md space-y-1 p-2 min-w-[90px]">
                                                <Button
                                                    onClick={() =>
                                                        navigate(
                                                            `/user/${user?.id}`
                                                        )
                                                    }
                                                    variant={"ghost"}
                                                >
                                                    Profile
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        logoutWithRedirect();
                                                    }}
                                                    variant={"ghost"}
                                                >
                                                    Logout
                                                </Button>
                                            </div>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                            <PostModal>
                                <Button>
                                    <IconPlus className="ml-[-4px] mr-2 h-4 w-4" />{" "}
                                    Post
                                </Button>
                            </PostModal>
                        </>
                    ) : (
                        <AuthModal>
                            <Button variant="ghost">Login</Button>
                        </AuthModal>
                    )}
                </div>
            </div>
            <hr />
        </div>
    );
}
