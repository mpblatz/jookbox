export function Skeleton({
    className,
    style,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={className}
            style={{
                background: "var(--skeleton-bg)",
                borderRadius: "8px",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                ...style,
            }}
            {...props}
        />
    );
}
