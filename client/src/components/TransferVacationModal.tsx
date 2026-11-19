import { useState, useEffect } from 'react';
import '../css/modal.css';

export interface VacationPeriodOption {
    id: string;
    periodRange: string;
    hoursAvailable: number;
}

interface TransferVacationModalProps {
    isOpen: boolean;
    periods: VacationPeriodOption[];
    onClose: () => void;
    onTransfer: (data: { fromId: string; toId: string; hours: number }) => void;
}

export function TransferVacationModal({
                                          isOpen,
                                          periods,
                                          onClose,
                                          onTransfer,
                                      }: TransferVacationModalProps) {
    const [fromId, setFromId] = useState<string>('');
    const [toId, setToId] = useState<string>('');
    const [hours, setHours] = useState<number>(1);

    useEffect(() => {
        if (isOpen && periods.length >= 2) {
            setFromId(periods[0].id);
            setToId(periods[1].id);
            setHours(1);
        }
    }, [isOpen, periods]);

    if (!isOpen) return null;

    const selectedFrom = periods.find((p) => p.id === fromId);
    const maxAvailable = selectedFrom ? selectedFrom.hoursAvailable : 1;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fromId || !toId || fromId === toId || hours <= 0) return;
        onTransfer({ fromId, toId, hours });
        onClose();
    };

    return (
        <div className="transfer-modal-backdrop" onClick={onClose} role="presentation">
            <div
                className="transfer-modal-card"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="transfer-modal-title"
            >
                <button
                    type="button"
                    className="transfer-close-btn"
                    onClick={onClose}
                    aria-label="Close dialog"
                >
                    ✕
                </button>

                {/* Top Calendar Icon Badge */}
                <div className="transfer-avatar-wrapper">
                    <span className="transfer-avatar-icon">📅</span>
                </div>

                {/* Header */}
                <div className="transfer-modal-header">
                    <span className="transfer-eyebrow">VACATION BANK</span>
                    <h2 id="transfer-modal-title" className="transfer-modal-title">
                        Transfer vacation days
                    </h2>
                </div>

                {/* Form */}
                <form className="transfer-form" onSubmit={handleSubmit}>
                    <div className="transfer-columns-grid">
                        {/* Column 1: TRANSFER FROM */}
                        <div className="transfer-column">
                            <span className="transfer-column-label">TRANSFER FROM</span>
                            <div className="transfer-options-list">
                                {periods.map((period) => {
                                    const isSelected = fromId === period.id;
                                    return (
                                        <label
                                            key={period.id}
                                            className={`transfer-option-card ${isSelected ? 'selected' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name="transfer-from"
                                                value={period.id}
                                                checked={isSelected}
                                                onChange={() => {
                                                    setFromId(period.id);
                                                    if (toId === period.id) {
                                                        const alternative = periods.find((p) => p.id !== period.id);
                                                        if (alternative) setToId(alternative.id);
                                                    }
                                                }}
                                                className="transfer-radio-input"
                                            />
                                            <span className="custom-radio-mark" />
                                            <div className="option-text-group">
                                                <span className="option-period-range">{period.periodRange}</span>
                                                <span className="option-hours-count">
                          {period.hoursAvailable} hours available
                        </span>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Column 2: TRANSFER TO */}
                        <div className="transfer-column">
                            <span className="transfer-column-label">TRANSFER TO</span>
                            <div className="transfer-options-list">
                                {periods.map((period) => {
                                    const isSelected = toId === period.id;
                                    const isDisabled = fromId === period.id;

                                    return (
                                        <label
                                            key={period.id}
                                            className={`transfer-option-card ${isSelected ? 'selected' : ''} ${
                                                isDisabled ? 'disabled' : ''
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="transfer-to"
                                                value={period.id}
                                                checked={isSelected}
                                                disabled={isDisabled}
                                                onChange={() => setToId(period.id)}
                                                className="transfer-radio-input"
                                            />
                                            <span className="custom-radio-mark" />
                                            <div className="option-text-group">
                                                <span className="option-period-range">{period.periodRange}</span>
                                                <span className="option-hours-count">
                          {period.hoursAvailable} hours available
                        </span>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Number of Hours Input */}
                    <div className="transfer-number-group">
                        <label htmlFor="transfer-hours-input" className="transfer-column-label">
                            NUMBER OF HOURS
                        </label>
                        <input
                            id="transfer-hours-input"
                            type="number"
                            min={1}
                            max={maxAvailable}
                            value={hours}
                            onChange={(e) => setHours(Math.max(1, Number(e.target.value)))}
                            className="transfer-number-input"
                            required
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="transfer-modal-actions">
                        <button type="button" className="btn-transfer-cancel" onClick={onClose}>
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            className="btn-transfer-submit"
                            disabled={!fromId || !toId || fromId === toId}
                        >
                            <span>✓</span>
                            <span>TRANSFER HOURS</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}