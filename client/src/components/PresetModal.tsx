import { useState, useEffect, type FormEvent } from 'react';
import { MyApi } from "../api/client";
import type { VacationAgreementResponseDto } from '../api/Api';
import '../css/view.css';


interface PresetModalProps {
    isOpen: boolean;
    agreement: VacationAgreementResponseDto | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function PresetModal({ isOpen, agreement, onClose, onSuccess }: PresetModalProps) {
    const isEditing = Boolean(agreement?.id);

    const [title, setTitle] = useState('');
    const [isMandatory, setIsMandatory] = useState(false);
    const [isOffered, setIsOffered] = useState(true);
    const [unit, setUnit] = useState('');
    const [rate, setRate] = useState('');

    const [earningStartDay, setEarningStartDay] = useState('');
    const [earningStartMonth, setEarningStartMonth] = useState('');
    const [earningEndDay, setEarningEndDay] = useState('');
    const [earningEndMonth, setEarningEndMonth] = useState('');
    const [earningEndOffset, setEarningEndOffset] = useState('');

    const [usageStartDay, setUsageStartDay] = useState('');
    const [usageStartMonth, setUsageStartMonth] = useState('');
    const [usageEndDay, setUsageEndDay] = useState('');
    const [usageEndMonth, setUsageEndMonth] = useState('');
    const [usageEndOffset, setUsageEndOffset] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (agreement && agreement.details) {
            const d = agreement.details;
            setTitle(agreement.title ?? '');
            setIsMandatory(agreement.isMandatory ?? false);
            setIsOffered(agreement.isOffered ?? true);
            setUnit(d.unit ?? '');
            setRate(d.rate !== null && d.rate !== undefined ? String(d.rate) : '');

            setEarningStartDay(d.earningStartDay !== null && d.earningStartDay !== undefined ? String(d.earningStartDay) : '');
            setEarningStartMonth(d.earningStartMonth !== null && d.earningStartMonth !== undefined ? String(d.earningStartMonth) : '');
            setEarningEndDay(d.earningEndDay !== null && d.earningEndDay !== undefined ? String(d.earningEndDay) : '');
            setEarningEndMonth(d.earningEndMonth !== null && d.earningEndMonth !== undefined ? String(d.earningEndMonth) : '');
            setEarningEndOffset(d.earningEndOffset !== null && d.earningEndOffset !== undefined ? String(d.earningEndOffset) : '');

            setUsageStartDay(d.usageStartDay !== null && d.usageStartDay !== undefined ? String(d.usageStartDay) : '');
            setUsageStartMonth(d.usageStartMonth !== null && d.usageStartMonth !== undefined ? String(d.usageStartMonth) : '');
            setUsageEndDay(d.usageEndDay !== null && d.usageEndDay !== undefined ? String(d.usageEndDay) : '');
            setUsageEndMonth(d.usageEndMonth !== null && d.usageEndMonth !== undefined ? String(d.usageEndMonth) : '');
            setUsageEndOffset(d.usageEndOffset !== null && d.usageEndOffset !== undefined ? String(d.usageEndOffset) : '');
        } else {
            setTitle('');
            setIsMandatory(false);
            setIsOffered(true);
            setUnit('');
            setRate('');
            setEarningStartDay('');
            setEarningStartMonth('');
            setEarningEndDay('');
            setEarningEndMonth('');
            setEarningEndOffset('');
            setUsageStartDay('');
            setUsageStartMonth('');
            setUsageEndDay('');
            setUsageEndMonth('');
            setUsageEndOffset('');
        }
        setError(null);
    }, [agreement, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const payload = {
            title,
            isMandatory,
            unit,
            rate: rate ? parseFloat(rate) : null,
            earningStartDay: earningStartDay ? parseInt(earningStartDay, 10) : null,
            earningStartMonth: earningStartMonth ? parseInt(earningStartMonth, 10) : null,
            earningEndDay: earningEndDay ? parseInt(earningEndDay, 10) : null,
            earningEndMonth: earningEndMonth ? parseInt(earningEndMonth, 10) : null,
            earningEndOffset: earningEndOffset ? parseInt(earningEndOffset, 10) : 0,
            usageStartDay: usageStartDay ? parseInt(usageStartDay, 10) : null,
            usageStartMonth: usageStartMonth ? parseInt(usageStartMonth, 10) : null,
            usageEndDay: usageEndDay ? parseInt(usageEndDay, 10) : null,
            usageEndMonth: usageEndMonth ? parseInt(usageEndMonth, 10) : null,
            usageEndOffset: usageEndOffset ? parseInt(usageEndOffset, 10) : 0,
        };

        try {
            if (isEditing && agreement?.id) {
                await MyApi.api.presetsUpdateAgreement(
                    { ...payload, isOffered },
                    { id: agreement.id }
                );
            } else {
                await MyApi.api.presetsCreateAgreement(payload);
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err?.detail || err?.title || 'Failed to save agreement.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="contract-modal-backdrop" onClick={onClose}>
            <div className="contract-modal-card" onClick={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    className="contract-modal-close"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    ✕
                </button>

                <div className="contract-modal-avatar-wrapper">
                    <div className="contract-modal-avatar">
                        <span className="contract-avatar-icon">📋</span>
                    </div>
                    <span className="contract-avatar-plus">{isEditing ? '✎' : '+'}</span>
                </div>

                <header className="contract-modal-header">
          <span className="contract-modal-eyebrow">
            {isEditing ? 'EDIT POLICY' : 'NEW SCHEME'}
          </span>
                    <h2 className="contract-modal-title">
                        {isEditing ? 'Configure Agreement' : 'Add Vacation Agreement'}
                    </h2>
                    <p className="modal-subtitle">
                        Set policy rules, earning intervals, and usage limits.
                    </p>
                </header>

                {error && <p>{error}</p>}

                <form className="contract-modal-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-field">
                            <label className="field-label">Policy Title</label>
                            <input
                                type="text"
                                className="field-input"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label className="field-label">Unit</label>
                            <select
                                className="field-input"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                            >
                                <option value="Hours">HOURS</option>
                                <option value="Days">DAYS</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label className="field-label">Rate / Month</label>
                            <input
                                type="text"
                                className="field-input"
                                required
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label className="field-label">Mandatory (Statutory)</label>
                            <select
                                className="field-input"
                                value={isMandatory ? 'true' : 'false'}
                                onChange={(e) => setIsMandatory(e.target.value === 'true')}
                            >
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>

                        {isEditing && (
                            <div className="form-field">
                                <label className="field-label">Policy Status</label>
                                <select
                                    className="field-input"
                                    value={isOffered ? 'true' : 'false'}
                                    onChange={(e) => setIsOffered(e.target.value === 'true')}
                                >
                                    <option value="true">Offered</option>
                                    <option value="false">Disabled</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label className="field-label">Earning Start Day</label>
                            <input
                                type="text"
                                className="field-input"
                                value={earningStartDay}
                                onChange={(e) => setEarningStartDay(e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label className="field-label">Earning Start Month</label>
                            <input
                                type="text"
                                className="field-input"
                                value={earningStartMonth}
                                onChange={(e) => setEarningStartMonth(e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label className="field-label">Earning End Day</label>
                            <input
                                type="text"
                                className="field-input"
                                value={earningEndDay}
                                onChange={(e) => setEarningEndDay(e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label className="field-label">Earning End Month</label>
                            <input
                                type="text"
                                className="field-input"
                                value={earningEndMonth}
                                onChange={(e) => setEarningEndMonth(e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label className="field-label">End Year Offset</label>
                            <input
                                type="text"
                                className="field-input"
                                value={earningEndOffset}
                                onChange={(e) => setEarningEndOffset(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label className="field-label">Usage Start Day</label>
                            <input
                                type="text"
                                className="field-input"
                                value={usageStartDay}
                                onChange={(e) => setUsageStartDay(e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label className="field-label">Usage Start Month</label>
                            <input
                                type="text"
                                className="field-input"
                                value={usageStartMonth}
                                onChange={(e) => setUsageStartMonth(e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label className="field-label">Usage End Day</label>
                            <input
                                type="text"
                                className="field-input"
                                value={usageEndDay}
                                onChange={(e) => setUsageEndDay(e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label className="field-label">Usage End Month</label>
                            <input
                                type="text"
                                className="field-input"
                                value={usageEndMonth}
                                onChange={(e) => setUsageEndMonth(e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label className="field-label">Usage Year Offset</label>
                            <input
                                type="text"
                                className="field-input"
                                value={usageEndOffset}
                                onChange={(e) => setUsageEndOffset(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="contract-modal-actions">
                        <button
                            type="button"
                            className="btn-contract-cancel"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-contract-submit"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Policy'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}