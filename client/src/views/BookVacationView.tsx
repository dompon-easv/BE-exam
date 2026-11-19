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

                <div className="booking-layout-grid">
                    {/* Calendar Picker Panel */}
                    <section className="booking-calendar-card" aria-label="Vacation date selector">
                        <h2 className="card-section-title">1. Select Vacation Dates</h2>
                        <div className="calendar-double-view">
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

                    {/* Period Allocation & Summary Panel */}
                    <section className="booking-allocation-card" aria-label="Period hours allocation">
                        <h2 className="card-section-title">2. Allocate Holiday Hours</h2>

                        <div className="periods-list">
                            {periods.map((period) => (
                                <div
                                    key={period.id}
                                    className={`allocation-period-row ${period.isSelected ? 'selected' : ''}`}
                                >
                                    <label className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            checked={period.isSelected}
                                            onChange={() => handleToggleSelect(period.id)}
                                        />
                                        <span className="checkmark" />
                                    </label>

                                    <div className="period-info">
                                        <span className="period-name">{period.name}</span>
                                        <span className="period-type">{period.type}</span>
                                        <span className="period-available">
                      {period.availableHours} hours available
                    </span>
                                    </div>

                                    <div className="stepper-control">
                                        <button
                                            type="button"
                                            className="stepper-btn"
                                            onClick={() => handleHourChange(period.id, -1)}
                                            disabled={!period.isSelected || period.selectedHours <= 0}
                                        >
                                            −
                                        </button>
                                        <span className="stepper-value">{period.selectedHours}h</span>
                                        <button
                                            type="button"
                                            className="stepper-btn"
                                            onClick={() => handleHourChange(period.id, 1)}
                                            disabled={!period.isSelected || period.selectedHours >= period.availableHours}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="allocation-summary-box">
                            <div className="summary-metric">
                                <span className="metric-label">TOTAL HOURS ALLOCATED</span>
                                <span className="metric-value">{totalCoveredHours} hrs</span>
                            </div>
                            <div className="summary-metric">
                                <span className="metric-label">VACATION DAYS</span>
                                <span className="metric-value">5 days</span>
                            </div>
                        </div>

                        <div className="booking-action-buttons">
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={() => navigate('/')}
                            >
                                CANCEL
                            </button>
                            <button
                                type="button"
                                className="btn-submit-request"
                                onClick={handleSubmitRequest}
                                disabled={totalCoveredHours === 0}
                            >
                                SUBMIT VACATION REQUEST
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            <button
                type="button"
                className="floating-help-btn"
                onClick={() => alert('Support & Help')}
                aria-label="Help and support"
            >
                ?
            </button>
        </div>
    );
}