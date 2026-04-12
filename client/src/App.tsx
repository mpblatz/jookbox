// app.tsx
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import SearchPage from "./pages/SearchPage";
import PostPage from "./pages/PostPage";
import SpotifyCallback from "./components/callbacks/SpotifyCallback";
import AuthCallback from "./components/callbacks/AuthCallback";
import PlaylistPage from "./pages/PlaylistPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

export default function App() {
    return (
        <Router>
            <div
                style={{
                    minHeight: "100vh",
                    maxWidth: "920px",
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "20px",
                }}
            >
                <div>
                    <Navbar />
                    <div style={{ marginTop: "8px", marginBottom: "32px" }}>
                        <AllRoutes />
                    </div>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

function AllRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route path="/feed" element={<HomePage />} />
            <Route path="/feed/following" element={<HomePage />} />

            <Route
                path="/search"
                element={<Navigate to="/search/users" />}
            />
            <Route path="/search/users" element={<SearchPage />} />
            <Route
                path="/search/posts"
                element={<SearchPage postsSearch />}
            />

            <Route path="/post/:id" element={<PostPage />} />
            <Route
                path="/post/:id/comments"
                element={<PostPage showComments />}
            />

            <Route path="/top/spotify/:id" element={<PlaylistPage />} />
            <Route path="/top/apple/:id" element={<PlaylistPage />} />

            <Route path="/user/:id" element={<UserPage />} />

            {/* Callbacks */}
            <Route path="/callback/auth" element={<AuthCallback />} />
            <Route path="/callback/spotify" element={<SpotifyCallback />} />

            {/*Privacy Policy */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
    );
}
