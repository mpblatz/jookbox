/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["selector", '[data-theme="dark"]'],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        extend: {
            colors: {
                bg: "var(--bg)",
                "card-bg": "var(--card-bg)",
                text: "var(--text)",
                "text-muted": "var(--text-muted)",
                "text-faint": "var(--text-faint)",
                accent: "var(--accent)",
                border: "var(--border)",
                divider: "var(--divider)",
            },
        },
    },
    plugins: [],
};
