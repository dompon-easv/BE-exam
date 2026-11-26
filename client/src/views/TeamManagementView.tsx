import {use, useEffect, useState} from 'react';
import { UserCard, type UserDto } from '../components/UserCard';
import { UserModal} from "../components/UserModal.tsx";
import '../css/view.css';
import {useNavigate} from "react-router-dom";

import {MyApi, showApiError} from "@/api/client.ts";
import {Role} from "@/api/Api.ts";

interface TeamManagementViewProps {
    role?: string;
}

export function TeamManagementView({role}: TeamManagementViewProps) {
    const isSystemOwner = role === 'SystemOwner';
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserDto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<UserDto | null>(null);


    const loadUsers = async () => {
        try {
            const res = await MyApi.api.userGetUsers();
            const mapped: UserDto[] = (res.data || []).map((u) => {
                const parts = (u.name || 'User').split(' ');
                const initials = `${parts[0]?.[0] || ''}${parts[1]?.[0] || ''}`.toUpperCase();
                return {
                    id: u.id || '',
                    fullName: u.name || '',
                    initials: initials || 'U',
                    role: u.role || 'Employee',
                    pendingRequestsCount: 0,
                    status: 'on-track',
                };
            });
            setUsers(mapped);
        } catch (err) {
            showApiError(err, 'Failed to load vacation agreements.');
        }
    };
    useEffect(() => {
        loadUsers();
    }, []);
    const handleAddUser = () => {
        setUserToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (id: string) => {
        const found = users.find((u) => u.id === id) || null;
        setUserToEdit(found);
        setIsModalOpen(true);
    };

    const handleSaveUser = async ({
        firstName,
        lastName,
        email,
    }: {
        firstName: string;
        lastName: string;
        email: string;
    }) => {
        try {
            await MyApi.api.userCreateUser({
                name: `${firstName} ${lastName}`,
                email: email,
                password: 'Password123!', //initial temporary password                                                                                     
                role: Role.Employee,
            });
            await loadUsers();
            setIsModalOpen(false);
        }catch (err: any) {
            showApiError(err, 'Failed to load vacation agreements.');
        }
    };

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
