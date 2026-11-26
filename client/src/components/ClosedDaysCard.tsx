import { useState, type FormEvent } from 'react';
import { MyApi } from "../api/client";
import type { ClosedDayDto } from '../api/Api';
import '../css/view.css';



interface ClosedDaysCardProps {
    closedDays?: ClosedDayDto[];
    loading?: boolean;
    onRefresh?: () => void;
}

export function ClosedDaysCard({ closedDays = [], loading = false, onRefresh }: ClosedDaysCardProps) {
    const [syncYear, setSyncYear] = useState<string>(String(new Date().getFullYear()));
    const [isSyncing, setIsSyncing] = useState(false);

    const [manualName, setManualName] = useState('');
    const [manualDate, setManualDate] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSyncHolidays = async () => {
        const yearNum = parseInt(syncYear, 10);
        if (!yearNum || yearNum < 2000 || yearNum > 2100) {
            alert('Please enter a valid 4-digit year.');
            return;
        }

        try {
            setIsSyncing(true);
            const res = await MyApi.api.presetsSyncHolidays({ year: yearNum, countryCode: 'DK' });
            alert(`Synchronized ${res.data} Danish bank holidays for ${yearNum}.`);
            onRefresh?.();
        } catch (err: any) {
            alert(err?.detail || err?.title || 'Holiday sync failed.');
        } finally {
            setIsSyncing(false);
        }
    };

    const handleCreateManualDay = async (e: FormEvent) => {
        e.preventDefault();
        if (!manualName || !manualDate) return;

        try {
            setIsAdding(true);
            await MyApi.api.presetsCreateClosedDay({
                name: manualName,
                date: manualDate,
            });
            setManualName('');
            setManualDate('');
            onRefresh?.();
        } catch (err: any) {
            alert(err?.detail || err?.title || 'Failed to add closed day.');
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteClosedDay = async (id?: string) => {
        if (!id) return;
        try {
            await MyApi.api.presetsDeleteClosedDay({ id });
            onRefresh?.();
        } catch (err: any) {
            alert(err?.detail || err?.title || 'Failed to delete closed day.');
        }
    };

    return (
        <article className="holiday-card">
            <div className="holiday-card-header">
                <span className="holiday-card-label">CALENDAR & CLOSURES</span>
                <h3 className="holiday-card-title">Public Holidays & Days Off</h3>
            </div>

            <div className="holiday-card-body">
                <div className="metric-row">
                    <span className="card-icon icon-calendar-event" />
                    <div className="metric-details">
                        <span className="metric-label">SYNC DANISH HOLIDAYS (NAGER API)</span>
                        <div className="form-row">
                            <input
                                type="text"
                                className="field-input"
                                value={syncYear}
                                onChange={(e) => setSyncYear(e.target.value)}
                                placeholder="Year (e.g. 2026)"
                            />
                            <button
                                type="button"
                                className="btn-book-action"
                                onClick={handleSyncHolidays}
                                disabled={isSyncing}
                            >
                                {isSyncing ? 'Syncing...' : 'Sync DK Holidays'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="metric-row">
                    <span className="card-icon icon-file-expiration" />
                    <div className="metric-details">
                        <span className="metric-label">ADD COMPANY-SPECIFIC DAY OFF</span>
                        <form onSubmit={handleCreateManualDay} className="form-row">
                            <input
                                type="text"
                                className="field-input"
                                placeholder="Day name (e.g. 24 Dec / Constitution Day)"
                                value={manualName}
                                onChange={(e) => setManualName(e.target.value)}
                                required
                            />
                            <input
                                type="date"
                                className="field-input"
                                value={manualDate}
                                onChange={(e) => setManualDate(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="btn-book-action"
                                disabled={isAdding}
                            >
                                {isAdding ? 'Adding...' : '＋ Add'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="metric-row">
                    <div className="metric-details">
                        <span className="metric-label">REGISTERED DAYS OFF ({closedDays.length})</span>
                        {loading ? (
                            <p>Loading days off...</p>
                        ) : closedDays.length === 0 ? (
                            <p>No days off registered yet. Sync Danish holidays above or add custom dates.</p>
                        ) : (
                            <div className="presets-card">
                                <table className="presets-table">
                                    <thead>
                                    <tr>
                                        <th>DATE</th>
                                        <th>NAME</th>
                                        <th>TYPE</th>
                                        <th>ACTION</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {closedDays.map((day) => (
                                        <tr key={day.id}>
                                            <td className="preset-label-cell">{day.date}</td>
                                            <td className="preset-value-cell">{day.name}</td>
                                            <td className="preset-value-cell">
                                                {day.isManual ? 'Company Day Off' : 'Public Holiday'}
                                            </td>
                                            <td className="preset-action-cell">
                                                <button
                                                    type="button"
                                                    className="btn-edit-contract"
                                                    onClick={() => handleDeleteClosedDay(day.id)}
                                                    title={`Remove ${day.name}`}
                                                    aria-label={`Remove ${day.name}`}
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}