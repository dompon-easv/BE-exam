import { useState, useEffect } from 'react';
import type { ContractDto } from './ContractCard';
import '../css/modal.css';

interface ContractModalProps {
    isOpen: boolean;
    contractToEdit?: ContractDto | null;
    onClose: () => void;
    onSave: (contract: ContractDto) => void;
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function ContractModal({ isOpen, contractToEdit, onClose, onSave }: ContractModalProps) {
    const [validFrom, setValidFrom] = useState('');
    const [validTo, setValidTo] = useState('');
    const [fte, setFte] = useState(1);
    const [dailyHours, setDailyHours] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

    useEffect(() => {
        if (contractToEdit) {
            setValidFrom(contractToEdit.validFrom ?? '');
            setValidTo(contractToEdit.validTo ?? '');
            setFte(contractToEdit.fte);
            setDailyHours(contractToEdit.schedule.map((s) => s.hours));
        } else {
            setValidFrom(new Date().toISOString().slice(0, 10));
            setValidTo('');
            setFte(1);
            setDailyHours([0, 0, 0, 0, 0, 0, 0]);
        }
    }, [contractToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const schedule = WEEKDAYS.map((day, idx) => ({
            day,
            hours: dailyHours[idx] ?? 0,
        }));

        onSave({
            id: contractToEdit?.id ?? '',
            badgeLabel: '',
            dateRange: '',
            fte,
            schedule,
            validFrom,
            validTo: validTo || undefined,
        });
    };

    return (
        <div className="contract-modal-backdrop" onClick={onClose}>
            <div className="contract-modal-card" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="contract-modal-close" onClick={onClose}>✕</button>

                <h2>{contractToEdit ? 'Edit Contract' : 'Add Contract'}</h2>

                <form onSubmit={handleSubmit} className="contract-modal-form">
                    <div className="contract-top-grid">
                        <label>
                            Valid From
                            <input type="date" required value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
                        </label>
                        <label>
                            Valid To
                            <input type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)} />
                        </label>
                        <label>
                            FTE
                            <input type="number" step="0.05" min="0.1" max="2" value={fte} onChange={(e) => setFte(parseFloat(e.target.value) || 0)} />
                        </label>
                    </div>

                    <div className="schedule-hours-row-4">
                        {WEEKDAYS.map((day, idx) => (
                            <label key={day}>
                                {day.slice(0, 3)}
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="24"
                                    value={dailyHours[idx] || ''}
                                    placeholder="0"
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        setDailyHours((prev) => prev.map((h, i) => (i === idx ? val : h)));
                                    }}
                                />
                            </label>
                        ))}
                    </div>

                    <div className="contract-modal-actions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}