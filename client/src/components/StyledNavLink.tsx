import { NavLink } from "react-router-dom";

export default function StyledNavLink({
    to,
    label,
    end = false,
    pendingClasses,
    activeClasses,
    style,
}: {
    to: string;
    label: string;
    end?: boolean;
    pendingClasses: string;
    activeClasses: string;
    style?: React.CSSProperties;
}) {
    return (
        <NavLink
            to={to}
            className={({ isActive, isPending }) =>
                isPending ? pendingClasses : isActive ? activeClasses : ""
            }
            style={({ isActive }) => ({
                color: isActive ? "var(--text)" : "var(--text-muted)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 400,
                textDecoration: "none",
                paddingBottom: "4px",
                transition: "color 0.2s ease",
                ...style,
            })}
            end={end}
        >
            {label}
        </NavLink>
    );
}
