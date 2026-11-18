import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { LoginView } from './views/LoginView';
import { MyVacationBank } from './views/MyVacationBank';
import { BookVacationView } from './views/BookVacationView';
import { MyVacationsView } from './views/MyVacationView';
import { TeamVacationOverviewView } from './views/TeamVacationView';
import { MyContractsView} from "./views/MyContractsView.tsx";
import './css/index.css';

export function App() {
    const [currentUser, setCurrentUser] = useState<{ name: string; role: string } | null>(null);

    const handleLogout = () => {
        setCurrentUser(null);
    };

    return (
        <BrowserRouter>
            <Routes>
                {!currentUser ? (
                    /* Unauthenticated Flow: Any URL redirects to /login */
                    <>
                        <Route
                            path="/login"
                            element={<LoginView onLoginSuccess={(user) => setCurrentUser(user)} />}
                        />
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
                            <Route path="/" element={<MyVacationBank />} />
                            <Route path="/book" element={<BookVacationView />} />
                            <Route path="/my-vacations" element={<MyVacationsView />} />
                            <Route path="/team-overview" element={<TeamVacationOverviewView />} />
                            <Route path="/my-contracts" element={<MyContractsView/>}></Route>
                        </Route>

                        {/* If authenticated user types /login, send them to home */}
                        <Route path="/login" element={<Navigate to="/" replace />} />
                        {/* Catch-all fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
}

export default App;