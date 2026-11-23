import '../css/card.css';

export interface VacationItemDto {
    id: string;
    monthShort: string;
    daySpan: string;
    title: string;
    dateDetail: string;
    durationDays: number;
    hours: number;
    amount: string;
    status: 'completed' | 'upcoming' | 'pending';
    statusLabel: string;
}

interface VacationRowCardProps {
    item: VacationItemDto;
}

export function VacationRowCard({ item }: VacationRowCardProps) {
    const getStatusDotClass = (status: VacationItemDto['status']) => {
        switch (status) {
            case 'completed':
                return 'dot-completed';
            case 'upcoming':
                return 'dot-upcoming';
            case 'pending':
                return 'dot-pending';
            default:
                return '';
        }
    };

    return (
        <article className={`vacation-card-row status-border-${item.status}`}>
            {/* 1. Date Stamp Badge */}
            <div className="vacation-date-badge">
                <span className="badge-month">{item.monthShort}</span>
                <span className="badge-days">{item.daySpan}</span>
            </div>

            {/* 2. Main Vacation Information */}
            <div className="vacation-main-info">
                <h3 className="vacation-item-title">{item.title}</h3>
                <p className="vacation-date-range">{item.dateDetail}</p>
            </div>

            {/* 3. Duration & Compensation Metrics */}
            <div className="vacation-metrics-group">
                <div className="metric-cell">
                    <span className="metric-label">DURATION</span>
                    <span className="metric-value">{item.durationDays} days</span>
                </div>
                <div className="metric-cell">
                    <span className="metric-label">HOURS</span>
                    <span className="metric-value">{item.hours} hrs</span>
                </div>
                <div className="metric-cell">
                    <span className="metric-label">COMPENSATION</span>
                    <span className="metric-value">{item.amount}</span>
                </div>
            </div>

            {/* 4. Status Indicator */}
            <div className="vacation-status-slot">
        <span className="status-pill">
          <span
              className={`status-dot ${getStatusDotClass(item.status)}`}
              aria-hidden="true"
          />
          <span className="status-label-text">{item.statusLabel}</span>
        </span>
            </div>
        </article>
    );
}