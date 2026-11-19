import { useState } from 'react';
import { UserCard, type UserDto } from '../components/UserCard';
import { UserModal} from "../components/UserModal.tsx";
import '../css/view.css';
import {useNavigate} from "react-router-dom";

const MOCK_USERS: UserDto[] = [
    {
        id: 'user-1',
        initials: 'AJ',
        avatarBgColor: '#fae5e0',
        avatarTextColor: '#ba5848',
        role: 'EMPLOYEE',
        fullName: 'Anna Jensen',
        pendingRequestsCount: 1,
        status: 'needs-attention',
    },
    {
        id: 'user-2',
        initials: 'MH',
        avatarBgColor: '#e5eef7',
        avatarTextColor: '#3b5570',
        role: 'EMPLOYEE',
        fullName: 'Mikkel Hansen',
        pendingRequestsCount: 0,
        status: 'on-track',
    },
    {
        id: 'user-3',
        initials: 'SN',
        avatarBgColor: '#fae5e0',
        avatarTextColor: '#ba5848',
        role: 'EMPLOYEE',
        fullName: 'Sofie Nielsen',
        pendingRequestsCount: 2,
        status: 'needs-attention',
    },
    {
        id: 'user-4',
        initials: 'FL',
        avatarBgColor: '#fae5e0',
        avatarTextColor: '#ba5848',
        role: 'EMPLOYEE',
        fullName: 'Frederik Larsen',
        pendingRequestsCount: 0,
        status: 'on-track',
    },
    {
        id: 'user-5',
        initials: 'CM',
        avatarBgColor: '#e5eef7',
        avatarTextColor: '#3b5570',
        role: 'EMPLOYEE',
        fullName: 'Clara Madsen',
        pendingRequestsCount: 1,
        status: 'needs-attention',
    },
];

interface TeamManagementViewProps {
    role?: string;
}

export function TeamManagementView({role}: TeamManagementViewProps) {
    const isSystemOwner = role === 'SYSTEM OWNER';
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserDto[]>(MOCK_USERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<UserDto | null>(null);

    const handleAddUser = () => {
        setUserToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (id: string) => {
        const found = users.find((u) => u.id === id) || null;
        setUserToEdit(found);
        setIsModalOpen(true);
    };

    const handleSaveUser = ({firstName, lastName}: { firstName: string; lastName: string }) => {
        const fullName = `${firstName} ${lastName}`;
        const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
    }

    const handleOpenProfile = (id: string) => {
                navigate(`/users/${id}`);
            }
        
        return (
            <div className="management-page-wrapper">
                <main className="management-container">
                    {/* Header Row: Title & Subtitle + Member Stats Widget */}
                    <div className="management-header-row">
                        <header className="management-header-titles">
                            <span className="management-eyebrow">ADMINISTRATION</span>
                            <h1 className="management-title">Team management</h1>
                            <p className="management-subtitle">
                                Select an employee to review their vacation activity and requests.
                            </p>
                        </header>

                        {/* Top-Right Pill Widget */}
                        <div className="team-count-widget">
                            <div className="widget-icon">👥</div>
                            <div className="widget-info">
                                <span className="widget-number">{users.length}</span>
                                <span className="widget-label">TEAM MEMBERS</span>
                            </div>
                            {isSystemOwner && (
                            <button
                                type="button"
                                className="widget-add-btn"
                                onClick={handleAddUser}
                                aria-label="Add employee"
                                title="Add Employee"
                            >
                                +
                            </button> )}
                        </div>
                    </div>

                    {/* Legend Row */}
                    <div className="management-legend-row">
                        <div className="legend-item">
                            <span className="legend-badge check-mark">✓</span>
                            <span>Vacation plan on track</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-badge alert-mark">!</span>
                            <span>Expiring days need to be planned</span>
                        </div>
                    </div>

                    {/* Employees Grid */}
                    <section className="management-grid" aria-label="Team members list">
                        {users.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onOpenProfile={handleOpenProfile}
                            />
                        ))}
                    </section>
                </main>

                {isSystemOwner && (
                <UserModal
                    isOpen={isModalOpen}
                    userToEdit={userToEdit}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveUser}
                />
                    )}

            </div>
        );
    }
