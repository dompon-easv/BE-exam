import '../css/navbar.css';

interface NavBarProps {
    userName?: string;
    role?: string;
    onCalendarClick?: () => void;
    onTeamClick?: () => void;
    onContractsClick?: () => void;
    onLogoutClick?: () => void;
}

export function NavBar({
                           userName = 'John Doe',
                           role = 'EMPLOYEE',
                           onCalendarClick,
                           onTeamClick,
                           onContractsClick,
                           onLogoutClick,
                       }: NavBarProps) {
    return (
        <header className="top-navbar">
            <div className="navbar-brand">
                <span className="brand-title">Holiday Portal</span>
                <span className="brand-subtitle">EMPLOYEE SELF-SERVICE</span>
            </div>

            <div className="navbar-actions">
                {/* Navigation Action Icons */}
                <div className="nav-icon-group">
                    {/* Contracts View Button */}
                    <button
                        type="button"
                        className="nav-icon-btn"
                        onClick={onContractsClick}
                        aria-label="My Contracts"
                        title="My Contracts"
                    >
                        <i className="nav-icon icon-document" aria-hidden="true" />
                    </button>

                    {/* Team Vacation Overview (People icon) */}
                    <button
                        type="button"
                        className="nav-icon-btn"
                        onClick={onTeamClick}
                        aria-label="Team Overview"
                        title="Team Overview"
                    >
                        <i className="nav-icon icon-team" aria-hidden="true" />
                    </button>

                    {/* My Vacations (Calendar icon) */}
                    <button
                        type="button"
                        className="nav-icon-btn"
                        onClick={onCalendarClick}
                        aria-label="My Vacations"
                        title="My Vacations"
                    >
                        <i className="nav-icon icon-calendar" aria-hidden="true" />
                    </button>
                </div>

                {/* User Identity & Logout */}
                <div className="nav-user-slot">
                    <div className="user-text">
                        <span className="user-name">{userName}</span>
                        <span className="user-role-badge">{role}</span>
                    </div>

                    <button
                        type="button"
                        className="btn-logout"
                        onClick={onLogoutClick}
                    >
                        LOGOUT
                    </button>
                </div>
            </div>
        </header>
    );
}