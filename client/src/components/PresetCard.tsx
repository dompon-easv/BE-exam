import type { VacationAgreementResponseDto } from '../api/Api';
import '../css/view.css';

function pad(val?: number | null): string {
    if (val === undefined || val === null) return '00';
    return String(val).padStart(2, '0');
}

function formatPeriod(
    startDay?: number | null,
    startMonth?: number | null,
    endDay?: number | null,
    endMonth?: number | null,
    endOffset?: number | null
): string {
    if (!startDay || !startMonth || !endDay || !endMonth) return '—';

    const startStr = `${pad(startDay)}/${pad(startMonth)}`;
    const endStr = `${pad(endDay)}/${pad(endMonth)}`;
    const offsetStr = endOffset && endOffset > 0 ? ` (+${endOffset}y)` : '';

    return `${startStr} – ${endStr}${offsetStr}`;
}

interface PresetCardProps {
    agreements: VacationAgreementResponseDto[];
    loading: boolean;
    errorMessage: string | null;
    onAddAgreement?: () => void;
    onEditAgreement?: (agreement: VacationAgreementResponseDto) => void;
    onDeleteAgreement?: (agreement: VacationAgreementResponseDto) => void;
}

export function PresetCard({
                                agreements,
                                loading,
                                errorMessage,
                                onAddAgreement,
                                onEditAgreement,
                                onDeleteAgreement,
                            }: PresetCardProps) {
    if (loading) return <p>Loading policies...</p>;
    if (errorMessage) return <p>{errorMessage}</p>;

    return (
        <>
            <div className="vacations-header-row">
                <div className="management-header-titles">
                    <span className="section-eyebrow">POLICIES</span>
                    <h2 className="section-title">Active Vacation Schemes</h2>
                </div>
                {onAddAgreement && (
                    <button
                        type="button"
                        className="btn-book-action"
                        onClick={onAddAgreement}
                    >
                        ＋ Add Policy
                    </button>
                )}
            </div>

            <div className="cards-three-grid">
                {(agreements ?? []).map((agreement) => {
                    const d = agreement.details;
                    const earningPeriod = formatPeriod(
                        d?.earningStartDay,
                        d?.earningStartMonth,
                        d?.earningEndDay,
                        d?.earningEndMonth,
                        d?.earningEndOffset
                    );
                    const usagePeriod = formatPeriod(
                        d?.usageStartDay,
                        d?.usageStartMonth,
                        d?.usageEndDay,
                        d?.usageEndMonth,
                        d?.usageEndOffset
                    );

                    return (
                        <article key={agreement.id} className="holiday-card">
                            <div className="holiday-card-header">
                <span className="holiday-card-label">
                  {agreement.isMandatory ? 'MANDATORY (STATUTORY)' : 'OPTIONAL BENEFIT'}
                </span>
                                <h3 className="holiday-card-title">{agreement.title}</h3>

                                {onEditAgreement && (
                                    <button
                                        type="button"
                                        className="btn-edit-contract"
                                        onClick={() => onEditAgreement(agreement)}
                                        title={`Edit ${agreement.title}`}
                                        aria-label={`Edit ${agreement.title}`}
                                    >
                                        ✏️
                                    </button>
                                )}

                                {!agreement.isMandatory && onDeleteAgreement && (
                                    <button
                                        type="button"
                                        className="btn-edit-contract"
                                        onClick={() => onDeleteAgreement(agreement)}
                                        title={`Delete ${agreement.title}`}
                                        aria-label={`Delete ${agreement.title}`}
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>

                            <div className="holiday-card-body">
                                <div className="metric-row">
                                    <span className="card-icon icon-clock-hours" />
                                    <div className="metric-details">
                                        <span className="metric-label">ACCRUAL RATE</span>
                                        <span className="metric-value">
                      {d?.rate} {d?.unit} / month
                    </span>
                                    </div>
                                </div>

                                <div className="metric-row">
                                    <span className="card-icon icon-calendar-event" />
                                    <div className="metric-details">
                                        <span className="metric-label">EARNING PERIOD</span>
                                        <span className="metric-value">{earningPeriod}</span>
                                    </div>
                                </div>

                                <div className="metric-row">
                                    <span className="card-icon icon-file-expiration" />
                                    <div className="metric-details">
                                        <span className="metric-label">USAGE PERIOD</span>
                                        <span className="metric-value">{usagePeriod}</span>
                                    </div>
                                </div>

                                <div className="metric-row">
                                    <div className="metric-details">
                                        <span className="metric-label">POLICY STATUS</span>
                                        <span className="metric-value">
                      {agreement.isOffered ? 'Offered' : 'Disabled'}
                    </span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </>
    );
}