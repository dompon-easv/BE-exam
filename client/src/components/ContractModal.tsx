import { useState, useEffect } from 'react';
import type { ContractDto } from './ContractCard';
import '../css/modal.css';

interface ContractModalProps {
    isOpen: boolean;
    contractToEdit?: ContractDto | null;
    onClose: () => void;
    onSave: (contract: ContractDto) => void;
}

const DEFAULT_SCHEDULE = [
    { day: 'Monday', hours: 7.5 },
    { day: 'Tuesday', hours: 7.5 },
    { day: 'Wednesday', hours: 7.5 },
    { day: 'Thursday', hours: 7.5 },
    { day: 'Friday', hours: 7 },
    { day: 'Saturday', hours: 0 },
    { day: 'Sunday', hours: 0 },
];

export function ContractModal({ isOpen, contractToEdit, onClose, onSave }: ContractModalProps) {
    const [validFrom, setValidFrom] = useState('2026-11-19');
    const [validTo, setValidTo] = useState('2026-11-19');
    const [fte, setFte] = useState<number>(1);
    const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);

    const isEditing = Boolean(contractToEdit);

    useEffect(() => {
        if (isOpen) {
            if (contractToEdit) {
                setValidFrom(contractToEdit.validFrom || '2026-01-01');
                setValidTo(contractToEdit.validTo || '2026-12-31');
                setFte(contractToEdit.fte);
                setSchedule(contractToEdit.schedule);
            } else {
                setValidFrom('2026-11-19');
                setValidTo('2026-11-19');
                setFte(1);
                setSchedule(DEFAULT_SCHEDULE);
            }
        }
    }, [isOpen, contractToEdit]);

    if (!isOpen) return null;

    const handleHourChange = (index: number, val: number) => {
        setSchedule((prev) =>
            prev.map((item, i) => (i === index ? { ...item, hours: Math.max(0, val) } : item))
        );
    };

    const formatDateLabel = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }).format(d);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const fromYear = new Date(validFrom).getFullYear();
        const currentYear = 2026;
        let badgeLabel = 'CURRENT CONTRACT';
        if (fromYear > currentYear) {
            badgeLabel = 'FUTURE CONTRACT';
        } else if (fromYear < currentYear) {
            badgeLabel = 'PREVIOUS CONTRACT';
        }

        const payload: ContractDto = {
            id: contractToEdit ? contractToEdit.id : `contract-${Date.now()}`,
            badgeLabel,
            dateRange: `${formatDateLabel(validFrom)} – ${formatDateLabel(validTo)}`,
            fte: Number(fte),
            schedule,
            validFrom,
            validTo,
        };

        onSave(payload);
        onClose();
    };

    return (
        <div className="contract-modal-backdrop" onClick={onClose} role="presentation">
            <div
                className="contract-modal-card"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="contract-modal-title"
            >
                <button
                    type="button"
                    className="contract-modal-close"
                    onClick={onClose}
                    aria-label="Close dialog"
                >
                    ✕
                </button>

                {/* Top Icon Badge */}
                <div className="contract-modal-avatar-wrapper">
                    <div className="contract-modal-avatar">
                        <span className="contract-avatar-icon">📄</span>
                    </div>
                    <span className="contract-avatar-plus">{isEditing ? '✏️' : '+'}</span>
                </div>

                {/* Header */}
                <div className="contract-modal-header">
                    <span className="contract-modal-eyebrow">EMPLOYMENT</span>
                    <h2 id="contract-modal-title" className="contract-modal-title">
                        {isEditing ? 'Edit contract dates' : 'Add contract'}
                    </h2>
                </div>

                {/* Form */}
                <form className="contract-modal-form" onSubmit={handleSubmit}>
                    {/* Metadata Row: Valid From, Valid To, FTE */}
                    <div className="contract-top-grid">
                        <div className="form-field">
                            <label htmlFor="valid-from" className="field-label">
                                VALID FROM
                            </label>
                            <input
                                id="valid-from"
                                type="date"
                                value={validFrom}
                                onChange={(e) => setValidFrom(e.target.value)}
                                className="contract-field-input"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="valid-to" className="field-label">
                                VALID TO
                            </label>
                            <input
                                id="valid-to"
                                type="date"
                                value={validTo}
                                onChange={(e) => setValidTo(e.target.value)}
                                className="contract-field-input"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="contract-fte" className="field-label">
                                FTE
                            </label>
                            <input
                                id="contract-fte"
                                type="number"
                                step="0.1"
                                min="0.1"
                                max="2.0"
                                value={fte}
                                disabled={isEditing}
                                onChange={(e) => setFte(parseFloat(e.target.value))}
                                className="contract-field-input"
                                required
                            />
                        </div>
                    </div>

                    {/* Scheduled Hours Section */}
                    <div className="contract-schedule-inputs-group">
                        <div className="schedule-header-flex">
                            <span className="schedule-headline">SCHEDULED HOURS</span>
                            {isEditing && (
                                <span className="schedule-locked-note">
                  ℹ️ To change work schedule, add a new contract
                </span>
                            )}
                        </div>

                        {/* Row 1: Monday - Thursday */}
                        <div className="schedule-hours-row-4">
                            {schedule.slice(0, 4).map((dayItem, index) => (
                                <div key={dayItem.day} className="form-field">
                                    <label className="field-label">{dayItem.day.toUpperCase()}</label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        min="0"
                                        max="24"
                                        value={dayItem.hours}
                                        disabled={isEditing}
                                        onChange={(e) => handleHourChange(index, parseFloat(e.target.value) || 0)}
                                        className="contract-field-input"
                                        required
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Row 2: Friday - Sunday */}
                        <div className="schedule-hours-row-3">
                            {schedule.slice(4, 7).map((dayItem, index) => (
                                <div key={dayItem.day} className="form-field">
                                    <label className="field-label">{dayItem.day.toUpperCase()}</label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        min="0"
                                        max="24"
                                        value={dayItem.hours}
                                        disabled={isEditing}
                                        onChange={(e) => handleHourChange(index + 4, parseFloat(e.target.value) || 0)}
                                        className="contract-field-input"
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="contract-modal-actions">
                        <button type="button" className="btn-contract-cancel" onClick={onClose}>
                            CANCEL
                        </button>
                        <button type="submit" className="btn-contract-submit">
                            <span>{isEditing ? '✓' : '+'}</span>
                            <span>{isEditing ? 'SAVE DATES' : 'ADD CONTRACT'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}