import '../css/card.css';

export interface DaySchedule {
    day: string;
    hours: number;
}

export interface ContractDto {
    id: string;
    badgeLabel: string; // e.g. "FUTURE CONTRACT", "CURRENT CONTRACT"
    dateRange: string;  // e.g. "January 1, 2026 – December 31, 2026"
    fte: number;        // e.g. 1.0
    schedule: DaySchedule[];
}

interface ContractCardProps {
    contract: ContractDto;
    onEdit?: (contract: ContractDto) => void;
}

export function ContractCard({ contract, onEdit }: ContractCardProps) {
    return (
        <article className="contract-card">
            {/* Header Slot (Dark Navy) */}
            <header className="contract-card-header">
                <div className="contract-header-icon-box">
                    <span className="contract-doc-icon">📄</span>
                </div>
                <div className="contract-header-titles">
                    <span className="contract-status-badge">{contract.badgeLabel}</span>
                    <h2 className="contract-range-text">{contract.dateRange}</h2>
                </div>


                {onEdit && (
                    <button
                        type="button"
                        className="btn-edit-contract"
                        onClick={() => onEdit(contract)}
                        aria-label={`Edit contract ${contract.dateRange}`}
                        title="Edit contract dates"
                    >
                        ✏️
                    </button>
                )}
                
            </header>

            {/* FTE Highlight Strip */}
            <div className="contract-fte-bar">
                <span className="fte-label">FULL-TIME EQUIVALENT</span>
                <span className="fte-value">{contract.fte.toFixed(1)} FTE</span>
            </div>

            {/* Scheduled Hours Schedule Table */}
            <div className="contract-schedule-section">
                <span className="schedule-section-label">SCHEDULED HOURS</span>

                <ul className="schedule-list">
                    {contract.schedule.map((item) => (
                        <li key={item.day} className="schedule-row">
                            <span className="schedule-day">{item.day}</span>
                            <span className="schedule-hours">
                {item.hours === 0 ? '0 hours' : `${item.hours} hours`}
              </span>
                        </li>
                    ))}
                </ul>
            </div>
        </article>
    );
}