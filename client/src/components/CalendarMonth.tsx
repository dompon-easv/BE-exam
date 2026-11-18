import {useMemo} from 'react';
import {generateCalendarGrid} from '../utils/calendarUtils';
import '../css/calendarMonth.css';

interface CalendarMonthProps {
    cardSubtitle?: string,
    cardTitle: string,
    year: number,
    monthIndex: number,
    startDate?: Date | null,
    endDate?: Date | null,
    onSelectDate?: (date: Date) => void,
    onPrevMonth?: () => void,
    onNextMonth?: () => void,
    month?: number
}

const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function CalendarMonth({
                                  cardSubtitle = 'SELECT DATE',
                                  cardTitle,
                                  year,
                                  monthIndex,
                                  startDate,
                                  endDate,
                                  onSelectDate,
                                  onPrevMonth,
                                  onNextMonth,
                                  month
                              }: CalendarMonthProps) {
    // Dynamically compute the 35/42 cells whenever year or month changes
    const days = useMemo(
        () => generateCalendarGrid(year, monthIndex),
        [year, monthIndex]
    );

    const monthLabel = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric',
    }).format(new Date(year, monthIndex, 1));

    function isSameDay(d1: Date | null | undefined, d2: Date) {
        if (!d1) return false;
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    }

    function isInSelectedRange(target: Date) {
        if (!startDate || !endDate) return false;
        const tTime = target.getTime();
        return tTime > startDate.getTime() && tTime < endDate.getTime();
    }

    return (
        <div className="calendar-card">
            <header className="calendar-card-header">
                <div className="calendar-card-icon-container">
                    <i className="calendar-icon icon-calendar-small" aria-hidden="true"/>
                </div>
                <div className="calendar-card-title-group">
                    <span className="calendar-card-subtitle">{cardSubtitle}</span>
                    <h3 className="calendar-card-heading">{cardTitle}</h3>
                </div>
            </header>

            <div className="calendar-nav-bar">
                <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={onPrevMonth}
                    aria-label="Previous month"
                >
                    ‹
                </button>
                <span className="calendar-nav-title">{monthLabel}</span>
                <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={onNextMonth}
                    aria-label="Next month"
                >
                    ›
                </button>
            </div>

            <div className="calendar-grid">
                {WEEK_DAYS.map((name) => (
                    <span key={name} className="calendar-weekday-cell">
            {name}
          </span>
                ))}

                {days.map((cell, index) => {
                    const isStart = isSameDay(startDate, cell.date);
                    const isEnd = isSameDay(endDate, cell.date);
                    const inRange = isInSelectedRange(cell.date);

                    let cellClass = 'calendar-day-cell';
                    if (!cell.isCurrentMonth) cellClass += ' day-inactive';
                    if (isStart || isEnd) cellClass += ' day-endpoint';
                    if (inRange) cellClass += ' day-in-range';

                    return (
                        <div
                            key={index}
                            className={cellClass}
                            onClick={() => cell.isCurrentMonth && onSelectDate?.(cell.date)}
                        >
                            {cell.dayNumber}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}