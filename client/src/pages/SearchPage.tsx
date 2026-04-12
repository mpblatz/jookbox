import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchPosts, searchUsers } from "@/api/routes/search";
import StyledNavLink from "@/components/StyledNavLink";
import { Search } from "lucide-react";

export default function SearchPage({ postsSearch = false }) {
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);

    const navigate = useNavigate();

    const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const searchTerm = e.target.value;
        if (!searchTerm) return;
        let data;
        if (postsSearch) {
            data = await searchPosts(searchTerm);
            setPosts(data);
        } else {
            data = await searchUsers(searchTerm);
            setUsers(data);
        }
    };

    const renderSearchResults = () => {
        if (postsSearch) {
            return (
                <div>
                    <ul style={{ display: "flex", flexDirection: "column", gap: "8px", listStyle: "none", padding: 0 }}>
                        {posts.map((post) => (
                            <li key={post.id}>
                                <button
                                    onClick={() => navigate(`/post/${post.id}`)}
                                    style={{
                                        display: "flex",
                                        gap: "16px",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "var(--text)",
                                        fontSize: "14px",
                                        fontFamily: "'IBM Plex Sans', sans-serif",
                                        padding: "8px",
                                        borderRadius: "8px",
                                        transition: "background 0.2s ease",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.background =
                                            "var(--btn-bg)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.background =
                                            "none")
                                    }
                                >
                                    <span>{post.title}</span>
                                    <span style={{ color: "var(--text-faint)" }}>·</span>
                                    <span style={{ color: "var(--text-muted)" }}>
                                        {post.author.displayName}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        } else {
            return (
                <div>
                    <ul style={{ display: "flex", flexDirection: "column", gap: "8px", listStyle: "none", padding: 0 }}>
                        {users.map((user) => (
                            <li key={user.id}>
                                <button
                                    onClick={() => navigate(`/user/${user.id}`)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "var(--text)",
                                        fontSize: "14px",
                                        fontFamily: "'IBM Plex Sans', sans-serif",
                                        padding: "8px",
                                        borderRadius: "8px",
                                        transition: "background 0.2s ease",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.background =
                                            "var(--btn-bg)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.background =
                                            "none")
                                    }
                                >
                                    {user.displayName}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", gap: "16px" }}>
                <StyledNavLink
                    to="/search/users"
                    label="Users"
                    pendingClasses=""
                    activeClasses="border-b-2"
                    style={{ borderColor: "var(--accent)" }}
                />
                <StyledNavLink
                    to="/search/posts"
                    label="Posts"
                    pendingClasses=""
                    activeClasses="border-b-2"
                    style={{ borderColor: "var(--accent)" }}
                />
            </div>

            <div style={{ position: "relative" }}>
                <div
                    style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-faint)",
                        pointerEvents: "none",
                    }}
                >
                    <Search size={16} />
                </div>
                <input
                    type="search"
                    placeholder="Search Users, Playlists..."
                    onChange={(e) => handleSearch(e)}
                    style={{
                        width: "100%",
                        padding: "10px 12px 10px 36px",
                        background: "var(--input-bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--text)",
                        fontSize: "14px",
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "var(--accent)")
                    }
                    onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "var(--border)")
                    }
                />
            </div>
            {renderSearchResults()}
        </div>
    );
}
