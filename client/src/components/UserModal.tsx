import { useState, useEffect } from 'react';
import type { UserDto } from './UserCard';
import '../css/modal.css';

interface UserModalProps {
    isOpen: boolean;
    userToEdit?: UserDto | null;
    onClose: () => void;
    onSave: (userData: { firstName: string; lastName: string; email: string }) => void;
}

export function UserModal({ isOpen, userToEdit, onClose, onSave }: UserModalProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const isEditing = Boolean(userToEdit);

    useEffect(() => {
        if (userToEdit) {
            const parts = userToEdit.fullName.split(' ');
            setFirstName(parts[0] || '');
            setLastName(parts.slice(1).join(' ') || '');
            setEmail(userToEdit.fullName.toLowerCase().replace(/\s+/g, '.') + '@company.dk');
        } else {
            setFirstName('');
            setLastName('');
            setEmail('');
        }
    }, [userToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim()) return;
        onSave({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() });
        onClose();
    };

    return (
        <div className="modal-backdrop" onClick={onClose} role="presentation">
            <div
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <button
                    type="button"
                    className="modal-close-btn"
                    onClick={onClose}
                    aria-label="Close dialog"
                >
                    ✕
                </button>

                {/* Top Avatar with Badge */}
                <div className="modal-avatar-wrapper">
                    <div className="modal-avatar">
                        <span className="modal-avatar-icon">👤</span>
                    </div>
                    <span className="modal-avatar-plus">+</span>
                </div>

                {/* Header */}
                <div className="modal-header">
                    <span className="modal-eyebrow">TEAM MANAGEMENT</span>
                    <h2 id="modal-title" className="modal-title">
                        {isEditing ? 'Edit employee' : 'Add a new employee'}
                    </h2>
                    <p className="modal-subtitle">
                        {isEditing
                            ? "Update the employee's details below."
                            : "Enter the employee's details to add them to your team."}
                    </p>
                </div>

                {/* Form */}
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="user-first-name" className="field-label">
                                FIRST NAME
                            </label>
                            <input
                                id="user-first-name"
                                type="text"
                                className="field-input"
                                placeholder="e.g. Emil"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                autoFocus
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="user-last-name" className="field-label">
                                LAST NAME
                            </label>
                            <input
                                id="user-last-name"
                                type="text"
                                className="field-input"
                                placeholder="e.g. Petersen"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="user-email" className="field-label">
                            EMAIL ADDRESS
                        </label>
                        <input
                            id="user-email"
                            type="email"
                            className="field-input"
                            placeholder="e.g. emil.petersen@businessesbjerg.dk"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-modal-cancel" onClick={onClose}>
                            CANCEL
                        </button>
                        <button type="submit" className="btn-modal-submit">
                            <span>+</span>
                            <span>{isEditing ? 'SAVE CHANGES' : 'ADD EMPLOYEE'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}