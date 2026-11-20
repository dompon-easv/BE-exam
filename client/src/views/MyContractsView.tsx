import { useState } from 'react';
import { ContractCard, type ContractDto } from '../components/ContractCard';
import '../css/myContractsView.css';

// Mock database data matching the design
const MOCK_CONTRACTS: ContractDto[] = [
  {
    id: 'contract-2',
    badgeLabel: 'FUTURE CONTRACT',
    dateRange: 'January 1, 2027 – December 31, 2027',
    fte: 1.0,
    schedule: [
      { day: 'Monday', hours: 7.5 },
      { day: 'Tuesday', hours: 7.5 },
      { day: 'Wednesday', hours: 7.5 },
      { day: 'Thursday', hours: 7.5 },
      { day: 'Friday', hours: 7 },
      { day: 'Saturday', hours: 0 },
      { day: 'Sunday', hours: 0 },
    ],
  },
  {
    id: 'contract-1',
    badgeLabel: 'CURRENT CONTRACT',
    dateRange: 'January 1, 2026 – December 31, 2026',
    fte: 1.0,
    schedule: [
      { day: 'Monday', hours: 7.5 },
      { day: 'Tuesday', hours: 7.5 },
      { day: 'Wednesday', hours: 7.5 },
      { day: 'Thursday', hours: 7.5 },
      { day: 'Friday', hours: 7 },
      { day: 'Saturday', hours: 0 },
      { day: 'Sunday', hours: 0 },
    ],
  },
];

export function MyContractsView() {
  // When hooking up to the backend, replace this initial state with a fetch/query call
  const [contracts] = useState<ContractDto[]>(MOCK_CONTRACTS);

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

        {/* Dynamic Card Grid */}
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