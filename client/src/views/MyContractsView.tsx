import { useEffect, useState } from 'react';
import { ContractCard, type ContractDto, type DaySchedule } from '../components/ContractCard';
import { Api, type ContractResponseDto } from '../api/Api';
import { MyApi, showApiError } from '../api/client';
import '../css/view.css';


//const api = new Api();

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function mapToCard(c: ContractResponseDto): ContractDto {
  const today = new Date().toISOString().slice(0, 10);

  const badgeLabel = (c.validTo && c.validTo < today) ? 'EXPIRED CONTRACT'
      : (c.validFrom && c.validFrom > today) ? 'FUTURE CONTRACT'
          : 'CURRENT CONTRACT';

  const schedule: DaySchedule[] = DAY_NAMES.map((day, index) => ({
    day,
    hours: c.workSchedules?.find((s) => s.weekday === index + 1)?.hours ?? 0,
  }));

  return {
    id: c.id ?? '',
    badgeLabel,
    dateRange: `${c.validFrom ?? ''} – ${c.validTo ?? 'Present'}`,
    fte: c.fte ?? 1.0,
    schedule,
  };
}

export function MyContractsView() {
  const [contracts, setContracts] = useState<ContractDto[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = localStorage.getItem('userId') || '';

    useEffect(() => {
        if (!currentUserId) {
            setLoading(false);
            return;
        }

        const loadContracts = async () => {
            try {
                setLoading(true);
                const res = await MyApi.api.contractsGetContracts({ userId: currentUserId });
                setContracts((res.data ?? []).map(mapToCard));
            } catch (err) {
                showApiError(err, 'Failed to load contracts.');
            } finally {
                setLoading(false);
            }
        };

        loadContracts();
    }, [currentUserId]);

  return (
      <div className="contracts-page-wrapper">
        <main className="contracts-container">
          <header className="contracts-header">
            <span className="contracts-eyebrow">EMPLOYMENT DOCUMENTS</span>
            <h1 className="contracts-title">My contracts</h1>
            <p className="contracts-subtitle">
              Review your contract periods and scheduled working hours.
            </p>
          </header>

          {loading && <p>Loading contracts...</p>}
            {!loading && contracts.length === 0 && <p>No contracts</p>}

          <section className="contracts-grid" aria-label="Employment contracts">
            {contracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
            ))}
          </section>
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