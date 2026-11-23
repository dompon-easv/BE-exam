import '../css/requestPanel.css';

export interface PendingRequestDto {
    id: string;
    dates: string;
    submittedDate: string;
    durationDays: number;
    hours: number;
}

interface PendingRequestsPanelProps {
    requests: PendingRequestDto[];
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export function RequestsPanel({
                                         requests,
                                         onApprove,
                                         onReject,
                                     }: PendingRequestsPanelProps) {
    if (requests.length === 0) return null;

    return (
        <section className="pending-panel-card" aria-label="Pending vacation requests">
            {/* Dark Navy Header Strip */}
            <header className="pending-panel-header">
                <div className="pending-header-titles">
                    <span className="pending-eyebrow">ACTION REQUIRED</span>
                    <h2 className="pending-title">Pending vacation requests</h2>
                </div>
                <span className="pending-count-pill">
          {requests.length} REQUEST{requests.length > 1 ? 'S' : ''}
        </span>
            </header>

            {/* Request Items */}
            <div className="pending-panel-body">
                {requests.map((item) => (
                    <div key={item.id} className="pending-item-row">
                        <div className="pending-item-main">
                            <div className="pending-date-icon">📅</div>
                            <div className="pending-dates-info">
                                <span className="pending-label">VACATION DATES</span>
                                <span className="pending-range">{item.dates}</span>
                                <span className="pending-submitted">{item.submittedDate}</span>
                            </div>
                        </div>

                        <div className="pending-metrics">
                            <div className="pending-metric-cell">
                                <span className="pending-metric-label">DURATION</span>
                                <span className="pending-metric-value">{item.durationDays} days</span>
                            </div>
                            <div className="pending-metric-cell">
                                <span className="pending-metric-label">HOURS</span>
                                <span className="pending-metric-value">{item.hours}</span>
                            </div>
                        </div>

                        <div className="pending-actions">
                            <button
                                type="button"
                                className="btn-action-reject"
                                onClick={() => onReject(item.id)}
                                aria-label="Reject vacation request"
                                title="Reject"
                            >
                                ✕
                            </button>
                            <button
                                type="button"
                                className="btn-action-approve"
                                onClick={() => onApprove(item.id)}
                                aria-label="Approve vacation request"
                                title="Approve"
                            >
                                ✓
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}