import { useNavigate } from 'react-router-dom';
import { HolidayCard } from '../components/HolidayCard';
import '../css/myVacationBank.css';

interface HolidayPeriodDto {
    id: string;
    periodRange: string;
    type: string;
    expiration: string;
    hoursAvailable: number;
    equivalentPayout: string;
}

const HARDCODED_HOLIDAY_PERIODS: HolidayPeriodDto[] = [
    {
        id: 'period-1',
        periodRange: 'September 2025 – August 2026',
        type: 'The Holiday Act',
        expiration: 'December 2026',
        hoursAvailable: 20,
        equivalentPayout: '3,000 DKK after tax',
    },
    {
        id: 'period-2',
        periodRange: 'September 2026 – August 2027',
        type: 'The Holiday Act',
        expiration: 'December 2027',
        hoursAvailable: 20,
        equivalentPayout: '3,000 DKK after tax',
    },
    {
        id: 'period-3',
        periodRange: 'January 2025 – December 2025',
        type: 'The KT. Agreement',
        expiration: 'May 2026 – April 2027',
        hoursAvailable: 37,
        equivalentPayout: '5,550 DKK after tax',
    },
];

export function MyVacationBank() {
    const navigate = useNavigate();

    return (
        <div className="bank-page-wrapper">
            <main className="bank-content-container">
                <header className="bank-header">
                    <span className="bank-eyebrow">TIME AWAY, MADE SIMPLE</span>
                    <h1 className="bank-title">Your Holiday Overview</h1>
                    <p className="bank-subtitle">
                        Here you can see your available holiday periods and remaining balance.
                    </p>
                </header>

                <section className="bank-grid" aria-label="Holiday periods">
                    {HARDCODED_HOLIDAY_PERIODS.map((period) => (
                        <HolidayCard
                            key={period.id}
                            periodRange={period.periodRange}
                            type={period.type}
                            expiration={period.expiration}
                            hoursAvailable={period.hoursAvailable}
                            equivalentPayout={period.equivalentPayout}
                        />
                    ))}
                </section>

                <div className="bank-actions">
                    <button
                        type="button"
                        className="btn-book-vacation"
                        onClick={() => navigate('/book')}
                    >
                        <i className="btn-icon icon-calendar-add" aria-hidden="true" />
                        <span>BOOK VACATION</span>
                    </button>
                </div>
            </main>
            
        </div>
    );
}