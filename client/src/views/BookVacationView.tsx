import { useState } from 'react';
import { Navbar } from '../components/NavBar';
import { CalendarMonth } from '../components/CalendarMonth';
import '../css/bookVacationView.css';

interface AllocationPeriod {
    id: string;
    periodLabel: string;
    periodRange: string;
    type: string;
    availableHours: number;
    allocatedHours: number;
    isSelected: boolean;
}

interface BookVacationViewProps {
    onBackToOverview: () => void;
    onHelpClick?: () => void;
}

const INITIAL_PERIODS: AllocationPeriod[] = [
    {
        id: 'period-1',
        periodLabel: 'PERIOD',
        periodRange: 'September 2025 – August 2026',
        type: 'The Holiday Act',
        availableHours: 20,
        allocatedHours: 20,
        isSelected: true,
    },
    {
        id: 'period-2',
        periodLabel: 'PERIOD',
        periodRange: 'September 2026 – August 2027',
        type: 'The Holiday Act',
        availableHours: 20,
        allocatedHours: 0,
        isSelected: true,
    },
    {
        id: 'period-3',
        periodLabel: 'PERIOD',
        periodRange: 'January 2025 – December 2025',
        type: 'The KT. Agreement',
        availableHours: 37,
        allocatedHours: 0,
        isSelected: true,
    },
];

export function BookVacationView({
                                     onBackToOverview,
                                     onHelpClick,
                                 }: BookVacationViewProps) {
    // Calendar date range state (Nov 30, 2026 - Dec 4, 2026 as shown in screenshot)
    const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 10, 30));
    const [endDate, setEndDate] = useState<Date | null>(new Date(2026, 11, 4));

    // Calendar month navigation state
    const [startMonth, setStartMonth] = useState({ year: 2026, monthIndex: 10 });
    const [endMonth, setEndMonth] = useState({ year: 2026, monthIndex: 11 });

    // Period balance allocation state
    const [periods, setPeriods] = useState<AllocationPeriod[]>(INITIAL_PERIODS);

    const totalAllocatedHours = periods.reduce((sum, item) => sum + item.allocatedHours, 0);
    const requiredHours = 37.5;

    const handleToggleSelect = (id: string) => {
        setPeriods((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, isSelected: !item.isSelected } : item
            )
        );
    };

    const handleStepperChange = (id: string, delta: number) => {
        setPeriods((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;
                const nextVal = item.allocatedHours + delta;
                if (nextVal < 0 || nextVal > item.availableHours) return item;
                return { ...item, allocatedHours: nextVal };
            })
        );
    };

    return (
        <div className="book-vacation-wrapper">
            <Navbar />

            <main className="book-vacation-content">
                {/* Back Link */}
                <button
                    type="button"
                    className="back-nav-btn"
                    onClick={onBackToOverview}
                >
                    ‹ HOLIDAY OVERVIEW
                </button>

                {/* Section Heading */}
                <header className="book-vacation-header">
                    <span className="book-vacation-eyebrow">PLAN YOUR TIME OFF</span>
                    <h1 className="book-vacation-title">Book your vacation</h1>
                    <p className="book-vacation-subtitle">
                        Choose your dates and the holiday balance you would like to use.
                    </p>
                </header>

                {/* Dual Calendar Cards */}
                <section className="calendars-row" aria-label="Select dates">
                    <CalendarMonth
                        cardTitle="Vacation start"
                        year={startMonth.year}
                        monthIndex={startMonth.monthIndex}
                        startDate={startDate}
                        endDate={endDate}
                        onSelectDate={(d) => setStartDate(d)}
                        onPrevMonth={() =>
                            setStartMonth((m) => ({
                                year: m.monthIndex === 0 ? m.year - 1 : m.year,
                                monthIndex: m.monthIndex === 0 ? 11 : m.monthIndex - 1,
                            }))
                        }
                        onNextMonth={() =>
                            setStartMonth((m) => ({
                                year: m.monthIndex === 11 ? m.year + 1 : m.year,
                                monthIndex: m.monthIndex === 11 ? 0 : m.monthIndex + 1,
                            }))
                        }
                    />

                    <CalendarMonth
                        cardTitle="Vacation end"
                        year={endMonth.year}
                        monthIndex={endMonth.monthIndex}
                        startDate={startDate}
                        endDate={endDate}
                        onSelectDate={(d) => setEndDate(d)}
                        onPrevMonth={() =>
                            setEndMonth((m) => ({
                                year: m.monthIndex === 0 ? m.year - 1 : m.year,
                                monthIndex: m.monthIndex === 0 ? 11 : m.monthIndex - 1,
                            }))
                        }
                        onNextMonth={() =>
                            setEndMonth((m) => ({
                                year: m.monthIndex === 11 ? m.year + 1 : m.year,
                                monthIndex: m.monthIndex === 11 ? 0 : m.monthIndex + 1,
                            }))
                        }
                    />
                </section>

                {/* Navy Summary Strip */}
                <section className="booking-summary-strip" aria-label="Booking summary">
                    <div className="summary-left">
                        <div className="summary-icon-box">
                            <i className="summary-icon icon-calendar-event" aria-hidden="true" />
                        </div>
                        <div className="summary-text-group">
                            <div className="summary-headline">
                                You are requesting <strong>5 vacation days</strong>.
                            </div>
                            <div className="summary-subtext">
                                You will be paid 5,625 DKK for this period.
                            </div>
                        </div>
                    </div>

                    <div className="summary-right">
                        <span className="summary-date-line">November 30, 2026</span>
                        <span className="summary-date-line">December 4, 2026</span>
                    </div>
                </section>

                {/* Balance Allocation Section */}
                <section className="balance-allocation-section">
                    <div className="balance-section-header">
                        <div>
                            <span className="book-vacation-eyebrow">HOLIDAY BALANCE</span>
                            <h2 className="balance-heading">Choose vacation periods</h2>
                        </div>
                        <span className="balance-helper-text">
              Select one or more periods to take your vacation days from.
            </span>
                    </div>

                    <div className="balance-rows-list">
                        {periods.map((item) => (
                            <div
                                key={item.id}
                                className={`allocation-card ${item.isSelected ? 'selected' : 'unselected'}`}
                            >
                                <div className="allocation-left">
                                    <label className="allocation-checkbox-label">
                                        <input
                                            type="checkbox"
                                            className="allocation-native-checkbox"
                                            checked={item.isSelected}
                                            onChange={() => handleToggleSelect(item.id)}
                                        />
                                        <span className="allocation-custom-checkbox">
                      <i className="icon icon-check" aria-hidden="true" />
                    </span>
                                    </label>

                                    <div className="allocation-info">
                                        <span className="allocation-period-tag">{item.periodLabel}</span>
                                        <h4 className="allocation-period-range">{item.periodRange}</h4>
                                        <span className="allocation-type">{item.type}</span>
                                    </div>
                                </div>

                                <div className="allocation-right">
                                    <div className="allocation-stepper-group">
                                        <span className="allocation-field-label">HOURS TO USE</span>
                                        <div className="stepper-box">
                                            <button
                                                type="button"
                                                className="stepper-action-btn"
                                                onClick={() => handleStepperChange(item.id, -1)}
                                                disabled={!item.isSelected || item.allocatedHours <= 0}
                                            >
                                                –
                                            </button>
                                            <span className="stepper-counter">{item.allocatedHours}</span>
                                            <button
                                                type="button"
                                                className="stepper-action-btn"
                                                onClick={() => handleStepperChange(item.id, 1)}
                                                disabled={!item.isSelected || item.allocatedHours >= item.availableHours}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="allocation-available-group">
                                        <span className="available-count">{item.availableHours}</span>
                                        <span className="available-text">HOURS AVAILABLE</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Allocation Progress Bar */}
                    <div className="allocation-status-bar">
                        <div className="allocation-status-metric">
                            <span className="status-label">HOURS ALLOCATED</span>
                            <span className="status-value">
                {totalAllocatedHours} / {requiredHours} hours
              </span>
                        </div>
                        <span className="status-instruction">
              Enter at least 1 hour for each selected period.
            </span>
                    </div>

                    {/* Action Row */}
                    <div className="allocation-actions-row">
                        <button
                            type="button"
                            className="btn-action-cancel"
                            onClick={onBackToOverview}
                        >
                            CANCEL
                        </button>
                        <button
                            type="button"
                            className="btn-action-submit"
                            onClick={() => alert('Vacation request submitted!')}
                        >
                            <span>SEND REQUEST</span>
                            <span className="btn-arrow">›</span>
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="portal-footer">
                <span className="footer-brand">HOLIDAY PORTAL</span>
                <span className="footer-service">EMPLOYEE SELF-SERVICE</span>
            </footer>

        </div>
    );
}