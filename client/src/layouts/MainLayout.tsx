import { Outlet, useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';

interface MainLayoutProps {
    userName?: string;
    role?: string;
    onLogout: () => void;
}

export function MainLayout({
                               userName,
                               role,
                               onLogout,
                           }: MainLayoutProps) {
    const navigate = useNavigate();

    return (
        <div className="app-root">
            <NavBar
                userName={userName}
                role={role}
                onCalendarClick={() => navigate('/my-vacations')}
                onTeamClick={() => navigate('/team-overview')}
                onContractsClick={() => navigate('/my-contracts')}
                onLogoutClick={onLogout}
                onUsersClick={() => navigate('/users')}
                onPresetsClick={() => navigate('/presets')}
            />
            <Outlet />
        </div>
    );
}