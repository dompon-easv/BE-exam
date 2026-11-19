import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarMonth } from '../components/CalendarMonth';
import '../css/bookVacationView.css';

interface AllocationPeriod {
    id: string;
    name: string;
    type: string;
    availableHours: number;
    selectedHours: number;
    isSelected: boolean;
}

const INITIAL_ALLOCATION_PERIODS: AllocationPeriod[] = [
    {
        id: 'per-1',
        name: 'September 2025 – August 2026',
        type: 'The Holiday Act',
        availableHours: 20,
        selectedHours: 20,
        isSelected: true,
    },
    {
        id: 'per-2',
        name: 'September 2026 – August 2027',
        type: 'The Holiday Act',
        availableHours: 20,
        selectedHours: 17,
        isSelected: true,
    },
    {
        id: 'per-3',
        name: 'January 2025 – December 2025',
        type: 'The KT. Agreement',
        availableHours: 37,
        selectedHours: 0,
        isSelected: false,
    },
];

export function BookVacationView() {
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 4, 11)); // May 11, 2026
    const [endDate, setEndDate] = useState<Date | null>(new Date(2026, 4, 15));   // May 15, 2026
    const [periods, setPeriods] = useState<AllocationPeriod[]>(INITIAL_ALLOCATION_PERIODS);

    const handleDateSelect = (date: Date) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
        } else if (startDate && !endDate) {
            if (date < startDate) {
                setStartDate(date);
            } else {
                setEndDate(date);
            }
        }
    };

    const handleToggleSelect = (id: string) => {
        setPeriods((prev) =>
            prev.map((p) => (p.id === id ? { ...p, isSelected: !p.isSelected } : p))
        );
    };

    const handleHourChange = (id: string, delta: number) => {
        setPeriods((prev) =>
            prev.map((p) => {
                if (p.id !== id) return p;
                const newHours = Math.max(0, Math.min(p.availableHours, p.selectedHours + delta));
                return { ...p, selectedHours: newHours, isSelected: newHours > 0 ? true : p.isSelected };
            })
        );
    };

    const totalCoveredHours = periods
        .filter((p) => p.isSelected)
        .reduce((sum, p) => sum + p.selectedHours, 0);

    const handleSubmitRequest = () => {
        alert(`Request submitted for ${totalCoveredHours} hours across selected periods!`);
        navigate('/my-vacations');
    };

    return (
        <div className="book-vacation-wrapper">
            <main className="book-vacation-content">
                <button
                    type="button"
                    className="back-nav-btn"
                    onClick={() => navigate('/')}
                >
                    ‹ HOLIDAY OVERVIEW
                </button>

                <header className="book-vacation-header">
                    <span className="book-vacation-eyebrow">TIME AWAY, MADE SIMPLE</span>
                    <h1 className="book-vacation-title">Book Vacation</h1>
                    <p className="book-vacation-subtitle">
                        Select your vacation dates and allocate your available holiday hours across active periods.
                    </p>
                </header>

                {/* Section 1: Calendar View */}
                <section className="booking-section" aria-label="Vacation date selector">
                    <h2 className="section-number-title">1. Select Vacation Dates</h2>
                    <div className="calendars-row">
                        <CalendarMonth
                            cardTitle="Start Date"
                            year={2026}
                            monthIndex={4} // May 2026
                            startDate={startDate}
                            endDate={endDate}
                            onSelectDate={handleDateSelect}
                        />
                        <CalendarMonth
                            cardTitle="End Date"
                            year={2026}
                            monthIndex={5} // June 2026
                            startDate={startDate}
                            endDate={endDate}
                            onSelectDate={handleDateSelect}
                        />
                    </div>
                </section>

                {/* Section 2: Allocate Holiday Hours */}
                <section className="booking-section" aria-label="Period hours allocation">
                    <div className="balance-section-header">
                        <h2 className="section-number-title">2. Allocate Holiday Hours</h2>
                        <span className="balance-helper-text">Select one or more periods to cover your requested days.</span>
                    </div>

                    <div className="balance-rows-list">
                        {periods.map((period) => (
                            <div
                                key={period.id}
                                className={`allocation-card ${period.isSelected ? 'selected' : ''}`}
                            >
                                <div className="allocation-left">
                                    <label className="allocation-checkbox-label">
                                        <input
                                            type="checkbox"
                                            className="allocation-native-checkbox"
                                            checked={period.isSelected}
                                            onChange={() => handleToggleSelect(period.id)}
                                        />
                                        <span className="allocation-custom-checkbox">
                                            <span className="icon-check" />
                                        </span>
                                    </label>

                                    <div className="allocation-info">
                                        <div className="period-tags-row">
                                            <span className="allocation-period-range">{period.name}</span>
                                            <span className="allocation-type-badge">{period.type}</span>
                                        </div>
                                        <span className="allocation-available-text">
                                            {period.availableHours} hours available
                                        </span>
                                    </div>
                                </div>

                                <div className="allocation-right">
                                    <div className="allocation-stepper-group">
                                        <div className="stepper-box">
                                            <button
                                                type="button"
                                                className="stepper-action-btn"
                                                onClick={() => handleHourChange(period.id, -1)}
                                                disabled={!period.isSelected || period.selectedHours <= 0}
                                                aria-label="Decrease hours"
                                            >
                                                −
                                            </button>
                                            <span className="stepper-counter">{period.selectedHours}h</span>
                                            <button
                                                type="button"
                                                className="stepper-action-btn"
                                                onClick={() => handleHourChange(period.id, 1)}
                                                disabled={!period.isSelected || period.selectedHours >= period.availableHours}
                                                aria-label="Increase hours"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Allocation Summary Status Bar */}
                    <div className="allocation-status-bar">
                        <div className="allocation-status-metric">
                            <span className="status-label">TOTAL HOURS ALLOCATED</span>
                            <span className="status-value highlight">{totalCoveredHours} hrs</span>
                        </div>
                        <div className="allocation-status-metric">
                            <span className="status-label">VACATION DAYS</span>
                            <span className="status-value">5 days</span>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="allocation-actions-row">
                        <button
                            type="button"
                            className="btn-action-cancel"
                            onClick={() => navigate('/')}
                        >
                            CANCEL
                        </button>
                        <button
                            type="button"
                            className="btn-action-submit"
                            onClick={handleSubmitRequest}
                            disabled={totalCoveredHours === 0}
                        >
                            <span>✓</span>
                            <span>SUBMIT VACATION REQUEST</span>
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}