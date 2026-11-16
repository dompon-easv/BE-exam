import '../css/navbar.css';

interface NavbarProps {
    userName?: string;
    role?: string;
    notificationCount?: number;
    onManagementClick?: () => void;
    onCalendarClick?: () => void;
    onNotificationClick?: () => void;
    onLogoutClick?: () => void;
}

export function Navbar({
                           userName = 'John Doe',
                           role = 'ADMIN',
                           notificationCount = 2,
                           onManagementClick,
                           onCalendarClick,
                           onNotificationClick,
                           onLogoutClick,
                       }: NavbarProps) {
    return (
        <header className="navbar">
            {/* Left: User Avatar & Info */}
            <div className="navbar-user">
                <div className="navbar-avatar">
                    <i className="icon icon-user-circle" />
                </div>
                <div className="navbar-user-info">
                    <span className="navbar-username">{userName}</span>
                    <span className="navbar-role">{role}</span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="navbar-actions">
                <button
                    type="button"
                    className="navbar-pill-btn"
                    onClick={onManagementClick}
                >
                    <i className="icon icon-management" />
                    <span>MANAGEMENT</span>
                </button>

                <button
                    type="button"
                    className="navbar-icon-btn"
                    onClick={onCalendarClick}
                    aria-label="Calendar overview"
                >
                    <i className="icon icon-calendar" />
                </button>

                <button
                    type="button"
                    className="navbar-icon-btn navbar-notification-container"
                    onClick={onNotificationClick}
                    aria-label={`Notifications, ${notificationCount} unread`}
                >
                    <i className="icon icon-bell" />
                    {notificationCount > 0 && (
                        <span className="navbar-badge">{notificationCount}</span>
                    )}
                </button>

                <button
                    type="button"
                    className="navbar-pill-btn"
                    onClick={onLogoutClick}
                >
                    <i className="icon icon-logout" />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
}