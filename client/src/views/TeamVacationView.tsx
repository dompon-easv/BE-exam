import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/teamVacation.css';

interface TooltipState {
    visible: boolean;
    x: number;
    y: number;
    month: string;
    day: number;
    count: number;
    names: string[];
}

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const VACATION_DATA: Record<string, Record<number, string[]>> = {
    July: {
        14: ['Sarah Connor', 'John Doe'],
        15: ['Sarah Connor', 'John Doe', 'Michael Scott'],
        16: ['Sarah Connor', 'John Doe', 'Michael Scott'],
        17: ['Sarah Connor', 'Michael Scott'],
        20: ['Sarah Connor'],
        21: ['Sarah Connor'],
    },
    August: {
        3: ['Dwight Schrute'],
        4: ['Dwight Schrute', 'Jim Halpert'],
        5: ['Dwight Schrute', 'Jim Halpert', 'Pam Beesly'],
    },
};

export function TeamVacationOverviewView() {
    const navigate = useNavigate();

    const [tooltip, setTooltip] = useState<TooltipState>({
        visible: false,
        x: 0,
        y: 0,
        month: '',
        day: 0,
        count: 0,
        names: [],
    });

    const handleCellMouseEnter = (
        e: React.MouseEvent<HTMLTableCellElement>,
        month: string,
        day: number
    ) => {
        const names = VACATION_DATA[month]?.[day] || [];
        const rect = e.currentTarget.getBoundingClientRect();

        setTooltip({
            visible: true,
            x: rect.left + rect.width / 2,
            y: rect.top - 8,
            month,
            day,
            count: names.length,
            names,
        });
    };

    const handleCellMouseLeave = () => {
        setTooltip((prev) => ({ ...prev, visible: false }));
    };

    return (
        <div className="team-vacation-wrapper">
            <main className="team-vacation-content">
                <button
                    type="button"
                    className="back-nav-btn"
                    onClick={() => navigate('/')}
                >
                    ‹ HOLIDAY OVERVIEW
                </button>

                <header className="team-vacation-header">
                    <span className="team-vacation-eyebrow">TEAM CALENDAR</span>
                    <h1 className="team-vacation-title">Team Vacation Overview</h1>
                    <p className="team-vacation-subtitle">
                        Annual heatmap showing overlapping team holidays and scheduled time off for 2026.
                    </p>
                </header>

                <div className="matrix-card">
                    <div className="matrix-table-scroll">
                        <table className="annual-vacation-matrix">
                            <thead>
                            <tr>
                                <th className="month-col-header">MONTH</th>
                                {DAYS.map((d) => (
                                    <th key={d} className="day-col-header">
                                        {d}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {MONTH_NAMES.map((month) => (
                                <tr key={month}>
                                    <td className="month-label-cell">{month}</td>
                                    {DAYS.map((day) => {
                                        const employees = VACATION_DATA[month]?.[day] || [];
                                        const count = employees.length;
                                        let intensityClass = 'cell-empty';
                                        if (count === 1) intensityClass = 'cell-low';
                                        if (count === 2) intensityClass = 'cell-medium';
                                        if (count >= 3) intensityClass = 'cell-high';

                                        return (
                                            <td
                                                key={day}
                                                className={`matrix-day-cell ${intensityClass}`}
                                                onMouseEnter={(e) => handleCellMouseEnter(e, month, day)}
                                                onMouseLeave={handleCellMouseLeave}
                                            >
                                                {count > 0 && <span className="cell-count">{count}</span>}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="matrix-legend-row">
                        <span className="legend-label">HEATMAP LEGEND:</span>
                        <div className="legend-item">
                            <span className="legend-swatch swatch-empty" />
                            <span>0 on leave</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-swatch swatch-low" />
                            <span>1 on leave</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-swatch swatch-medium" />
                            <span>2 on leave</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-swatch swatch-high" />
                            <span>3+ on leave</span>
                        </div>
                    </div>
                </div>

                {/* Hover Tooltip */}
                {tooltip.visible && (
                    <div
                        className="matrix-hover-tooltip"
                        style={{
                            left: `${tooltip.x}px`,
                            top: `${tooltip.y}px`,
                        }}
                    >
                        <div className="tooltip-date">
                            {tooltip.month} {tooltip.day}, 2026
                        </div>
                        <div className="tooltip-status">
                            {tooltip.count === 0 ? (
                                <span className="tooltip-empty">No team members on leave</span>
                            ) : (
                                <>
                  <span className="tooltip-count">
                    {tooltip.count} team member{tooltip.count > 1 ? 's' : ''} on leave:
                  </span>
                                    <ul className="tooltip-names-list">
                                        {tooltip.names.map((name) => (
                                            <li key={name}>{name}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>
                )}
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