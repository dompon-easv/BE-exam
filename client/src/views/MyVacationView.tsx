import { useNavigate } from 'react-router-dom';
import { VacationRowCard, VacationItemDto } from '../components/VacationRowCard';
import '../css/view.css';

const HARDCODED_VACATIONS: VacationItemDto[] = [
    {
        id: 'vac-1',
        monthShort: 'AUG',
        daySpan: '11–15',
        title: 'Summer holiday with family',
        dateDetail: 'Monday, 11 Aug 2025 – Friday, 15 Aug 2025',
        durationDays: 5,
        hours: 37,
        amount: 'DKK 5,550.00',
        status: 'completed',
        statusLabel: 'Completed',
    },
    {
        id: 'vac-2',
        monthShort: 'DEC',
        daySpan: '22–26',
        title: 'Christmas & New Year break',
        dateDetail: 'Monday, 22 Dec 2025 – Friday, 26 Dec 2025',
        durationDays: 5,
        hours: 37,
        amount: 'DKK 5,550.00',
        status: 'completed',
        statusLabel: 'Completed',
    },
    {
        id: 'vac-3',
        monthShort: 'MAY',
        daySpan: '11–15',
        title: 'Spring getaway',
        dateDetail: 'Monday, 11 May 2026 – Friday, 15 May 2026',
        durationDays: 5,
        hours: 37,
        amount: 'DKK 5,550.00',
        status: 'upcoming',
        statusLabel: 'Upcoming',
    },
    {
        id: 'vac-4',
        monthShort: 'JUL',
        daySpan: '20–31',
        title: 'Main summer vacation',
        dateDetail: 'Monday, 20 Jul 2026 – Friday, 31 Jul 2026',
        durationDays: 10,
        hours: 74,
        amount: 'DKK 11,100.00',
        status: 'pending',
        statusLabel: 'Pending Approval',
    },
];

export function MyVacationsView() {
    const navigate = useNavigate();

    return (
        <div className="vacations-page-wrapper">
            <main className="vacations-container">
                <button
                    type="button"
                    className="back-nav-btn"
                    onClick={() => navigate('/')}
                >
                    ‹ HOLIDAY OVERVIEW
                </button>

                <div className="vacations-header-row">
                    <div>
                        <span className="vacations-eyebrow">YOUR TIME AWAY</span>
                        <h1 className="vacations-title">My vacations</h1>
                        <p className="vacations-subtitle">
                            Review your previous vacations, upcoming time off, and requests in progress.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn-book-action"
                        onClick={() => navigate('/book')}
                    >
                        <i className="btn-icon icon-calendar-add" aria-hidden="true" />
                        <span>BOOK VACATION</span>
                    </button>
                </div>

                <section className="vacations-list" aria-label="Vacation entries">
                    {HARDCODED_VACATIONS.map((item) => (
                        <VacationRowCard key={item.id} item={item} />
                    ))}
                </section>

                <div className="vacation-note-row">
                    <i className="icon-clock-note" aria-hidden="true" />
                    <span>Pending requests will appear as upcoming vacations after supervisor approval.</span>
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