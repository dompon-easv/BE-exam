import {useState, type FormEvent, use} from 'react';
import { useAuth } from "@/auth/AuthProvider.tsx";
import '../css/loginView.css';

interface LoginViewProps {
    onHelpClick?: () => void;
}
export function LoginView({ onHelpClick: _onHelpClick }: LoginViewProps) {
    const { login } = useAuth();
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if(isLoading) return;
        setError(null);
        setIsLoading(true);
        
        try {
            await login({
                email: emailInput.trim(),
                password: passwordInput,
            });
            setPasswordInput('');
        }catch (err:any){
            setError(err instanceof Error ? err.message : 'Invalid email or password.');
        }finally {
            setIsLoading(false)
        }
    };

    const handleQuickFill = (roleKey: string) => {
        setEmailInput(roleKey);
        setError(null);
    };

    return (
        <div className="login-page-wrapper">
            <main className="login-card-container">
                <header className="login-header">
                    <span className="login-eyebrow">EMPLOYEE SELF-SERVICE</span>
                    <h1 className="login-title">Holiday Portal</h1>
                    <p className="login-subtitle">
                        Sign in to view your holiday bank, request time off, or manage approvals.
                    </p>
                </header>

                <div className="login-card">
                    {error && (
                        <div className="login-error-banner" role="alert">
                            <i className="error-icon" aria-hidden="true" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="login-email" className="form-label">
                                EMAIL OR ROLE IDENTIFIER
                            </label>
                            <input
                                id="login-email"
                                type="text"
                                className="form-input"
                                placeholder="user, accountant, or system_owner"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                autoFocus
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="login-password" className="form-label">
                                PASSWORD
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                className="form-input input-disabled-mock"
                                placeholder="Not required yet"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-login-submit">
                            <span>SIGN IN</span>
                            <span className="btn-arrow" aria-hidden="true">›</span>
                        </button>
                    </form>

                    <div className="login-quick-roles">
                        <span className="quick-roles-title">DEV QUICK-SELECT:</span>
                        <div className="quick-roles-pills">
                            <button
                                type="button"
                                className="role-pill"
                                onClick={() => handleQuickFill('user')}
                            >
                                user
                            </button>
                            <button
                                type="button"
                                className="role-pill"
                                onClick={() => handleQuickFill('accountant')}
                            >
                                accountant
                            </button>
                            <button
                                type="button"
                                className="role-pill"
                                onClick={() => handleQuickFill('system_owner')}
                            >
                                system_owner
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="portal-footer">
                <span className="footer-brand">HOLIDAY PORTAL</span>
                <span className="footer-service">EMPLOYEE SELF-SERVICE</span>
            </footer>
            
        </div>
    );
}