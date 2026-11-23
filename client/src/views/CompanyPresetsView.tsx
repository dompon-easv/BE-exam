import { useState } from 'react';
import '../css/view.css';

interface PresetItem {
    id: string;
    label: string;
    value: string;
}

const INITIAL_PRESETS: PresetItem[] = [
    { id: 'p1', label: 'Weeks 1–5: days earned per month', value: '2.08' },
    { id: 'p2', label: 'Weeks 1–5: earning period / usage period', value: '1 Sep – 31 Aug / 1 Sep – 31 Dec the following year' },
    { id: 'p3', label: '6th week enabled', value: 'Yes' },
    { id: 'p4', label: '6th week: hours earned per month (full time)', value: '3.083' },
    { id: 'p5', label: '6th week: earning period / usage period', value: '1 Jan – 31 Dec / 1 May – 30 Apr' },
    { id: 'p6', label: 'Calendar of public holidays and company days off', value: 'Danish public holidays + company-specific days (e.g. 24 and 31 December)' },
];

export function CompanyPresetsView() {
    const [presets, setPresets] = useState<PresetItem[]>(INITIAL_PRESETS);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [draftValue, setDraftValue] = useState<string>('');

    const handleStartEdit = (item: PresetItem) => {
        setEditingId(item.id);
        setDraftValue(item.value);
    };

    const handleSave = (id: string) => {
        setPresets((prev) =>
            prev.map((item) => (item.id === id ? { ...item, value: draftValue } : item))
        );
        setEditingId(null);
    };

    const handleCancel = () => {
        setEditingId(null);
        setDraftValue('');
    };

    return (
        <div className="profile-page-wrapper">
            <main className="profile-container">
                <header className="profile-header">
                    <span className="profile-eyebrow">ADMINISTRATION</span>
                    <h1 className="profile-title">Company presets</h1>
                    <p className="profile-subtitle">
                        Review the shared defaults used for vacation balances and employee requests.
                    </p>
                </header>

                <section className="presets-card">
                    <table className="presets-table">
                        <thead>
                        <tr>
                            <th style={{ width: '42%' }}>PRESET</th>
                            <th style={{ width: '50%' }}>CURRENT VALUE</th>
                            <th style={{ width: '8%', textAlign: 'right' }}>ACTION</th>
                        </tr>
                        </thead>
                        <tbody>
                        {presets.map((item) => {
                            const isEditing = editingId === item.id;
                            return (
                                <tr key={item.id}>
                                    <td className="preset-label-cell">{item.label}</td>
                                    <td className="preset-value-cell">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="preset-inline-input"
                                                value={draftValue}
                                                onChange={(e) => setDraftValue(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleSave(item.id);
                                                    if (e.key === 'Escape') handleCancel();
                                                }}
                                                autoFocus
                                            />
                                        ) : (
                                            <span>{item.value}</span>
                                        )}
                                    </td>
                                    <td className="preset-action-cell">
                                        {isEditing ? (
                                            <div className="preset-edit-actions">
                                                <button
                                                    type="button"
                                                    className="btn-preset-save"
                                                    onClick={() => handleSave(item.id)}
                                                    title="Save"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-preset-cancel"
                                                    onClick={handleCancel}
                                                    title="Cancel"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn-edit-contract"
                                                onClick={() => handleStartEdit(item)}
                                                aria-label={`Edit ${item.label}`}
                                                title="Edit preset"
                                            >
                                                ✏️
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
}