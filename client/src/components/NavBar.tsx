import '../css/navbar.css';

interface NavBarProps {
    userName?: string;
    role?: string;
    onCalendarClick?: () => void;
    onTeamClick?: () => void;
    onContractsClick?: () => void;
    onUsersClick?: () => void;
    onPresetsClick?: () => void;
    onLogoutClick?: () => void;
}

export function NavBar({
                           userName = 'John Doe',
                           role = 'EMPLOYEE',
                           onCalendarClick,
                           onTeamClick,
                           onContractsClick,
                           onUsersClick,
    onPresetsClick,
                           onLogoutClick,
                       }: NavBarProps) {
    const isManagementRole = role === 'Accountant' || role === 'SystemOwner';
    const isSystemOwner = role === 'SystemOwner';

    const getSubtitle = () => {
        if (role === 'SystemOwner') return 'SYSTEM OWNER CONSOLE';
        if (role === 'Accountant') return 'ACCOUNTANT CONSOLE';
        return 'EMPLOYEE SELF-SERVICE';
    };

    return (
        <header className="top-navbar">
            <div className="navbar-brand">
                <span className="brand-title">Holiday Portal</span>
                <span className="brand-subtitle">
          {getSubtitle()}
        </span>
            </div>

            <div className="navbar-actions">
                <div className="nav-icon-group">
                    {isManagementRole ? (
                        /* --- Management Navigation --- */
                        <>
                            {isSystemOwner && (
                                <button
                                    type="button"
                                    className="nav-icon-btn"
                                    onClick={onPresetsClick}
                                    aria-label="Company Presets"
                                    title="Company Presets"
                                >
                                    ⚙️
                                </button>
                            )}
                            {/* Users management */}
                            <button
                                type="button"
                                className="nav-icon-btn"
                                onClick={onUsersClick}
                                aria-label="Manage Users"
                                title="Users"
                            >
                                👤
                            </button>

                            {/* Team Overview */}
                            <button
                                type="button"
                                className="nav-icon-btn"
                                onClick={onTeamClick}
                                aria-label="Team Overview"
                                title="Team Overview"
                            >
                                👥
                            </button>
                        </>
                    ) : (
                        /* --- Regular Employee Navigation --- */
                        <>
                            {/* My Contracts */}
                            <button
                                type="button"
                                className="nav-icon-btn"
                                onClick={onContractsClick}
                                aria-label="My Contracts"
                                title="My Contracts"
                            >
                                📄
                            </button>

                            {/* Team Overview */}
                            <button
                                type="button"
                                className="nav-icon-btn"
                                onClick={onTeamClick}
                                aria-label="Team Overview"
                                title="Team Overview"
                            >
                                👥
                            </button>

                            {/* My Vacations */}
                            <button
                                type="button"
                                className="nav-icon-btn"
                                onClick={onCalendarClick}
                                aria-label="My Vacations"
                                title="My Vacations"
                            >
                                📅
                            </button>
                        </>
                    )}
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