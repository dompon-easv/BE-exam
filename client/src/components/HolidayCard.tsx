import '../css/card.css';

interface HolidayCardProps {
    periodLabel?: string;
    periodRange: string;
    type: string;
    expiration: string;
    hoursAvailable: number;
    equivalentPayout: string;
}

export function HolidayCard({
                                periodLabel = 'PERIOD',
                                periodRange,
                                type,
                                expiration,
                                hoursAvailable,
                                equivalentPayout,
                            }: HolidayCardProps) {
    return (
        <article className="holiday-card">
            <header className="holiday-card-header">
                <span className="holiday-card-label">{periodLabel}</span>
                <h3 className="holiday-card-title">{periodRange}</h3>
            </header>

            <div className="holiday-card-body">
                {/* Type */}
                <div className="metric-row">
                    <i className="card-icon icon-calendar-event" aria-hidden="true" />
                    <div className="metric-details">
                        <span className="metric-label">TYPE</span>
                        <span className="metric-value">{type}</span>
                    </div>
                </div>

                {/* Expiration */}
                <div className="metric-row">
                    <i className="card-icon icon-file-expiration" aria-hidden="true" />
                    <div className="metric-details">
                        <span className="metric-label">EXPIRATION</span>
                        <span className="metric-value">{expiration}</span>
                    </div>
                </div>

                {/* Hours Available */}
                <div className="metric-row">
                    <i className="card-icon icon-clock-hours" aria-hidden="true" />
                    <div className="metric-details">
                        <span className="metric-label">HOURS AVAILABLE</span>
                        <span className="metric-value">{hoursAvailable}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}