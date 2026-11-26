import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { LoginView } from './views/LoginView';
import { MyVacationBank } from './views/MyVacationBank';
import { BookVacationView } from './views/BookVacationView';
import { MyVacationsView } from './views/MyVacationView';
import { TeamVacationOverviewView } from './views/TeamVacationView';
import { MyContractsView } from './views/MyContractsView';
import { TeamManagementView } from './views/TeamManagementView';
import { EmployeeProfileView } from './views/EmployeeProfileView';
import {CompanyPresetsView} from "./views/CompanyPresetsView.tsx";
import './css/index.css';
import {useAuth} from "@/auth/AuthProvider.tsx";


function AppRoutes() {
    const navigate = useNavigate();
    const {user : currentUser, logout} = useAuth()
    
    const isManagementRole = (role: string) =>
        role === 'Accountant' || role === 'SystemOwner';

    const handleLogout = () => {
        logout()
        navigate('/login');
    };

    return (
        <Routes>
            {!currentUser ? (
                /* Unauthenticated Flow: Any URL redirects to /login */
                <>
                    <Route path="/login" element={<LoginView />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </>
            ) : (
                /* Authenticated Flow: Persistent MainLayout holding NavBar + Views */
                <>
                    <Route
                        element={
                            <MainLayout
                                userName={currentUser.name}
                                role={currentUser.role}
                                onLogout={handleLogout}
                            />
                        }
                    >
                        {/* Root Route: Redirects Accountant to /users, otherwise loads MyVacationBank */}
                        <Route
                            path="/"
                            element={
                                isManagementRole(currentUser.role) ? (
                                    <Navigate to="/users" replace />
                                ) : (
                                    <MyVacationBank />
                                )
                            }
                        />
                        <Route path="/book" element={<BookVacationView />} />
                        <Route path="/my-vacations" element={<MyVacationsView />} />
                        <Route path="/team-overview" element={<TeamVacationOverviewView />} />
                        <Route path="/my-contracts" element={<MyContractsView />} />
                        <Route path="/users" element={<TeamManagementView role={currentUser.role}/>} />
                        <Route path="/users/:id" element={<EmployeeProfileView role={currentUser.role} />} />
                        <Route path="/presets" element={currentUser.role === 'SystemOwner' ? (<CompanyPresetsView />) : (<Navigate to="/" replace />)}/>
                    </Route>

                    {/* If authenticated user types /login, send them to home */}
                    <Route path="/login" element={<Navigate to="/" replace />} />
                    {/* Catch-all fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </>
            )}
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}