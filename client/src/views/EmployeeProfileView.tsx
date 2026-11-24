import {JSX, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HolidayCard } from '../components/HolidayCard';
import { ContractCard, type ContractDto } from '../components/ContractCard';
import { RequestsPanel, type PendingRequestDto } from '../components/RequestPanel';
import '../css/view.css';
import { UserModal} from "../components/UserModal.tsx";
import type {UserDto} from "@/components/UserCard.tsx";
import { TransferVacationModal, type VacationPeriodOption } from '../components/TransferVacationModal';
import { ContractModal } from '../components/ContractModal';


interface PeriodState extends VacationPeriodOption {
    type: string;
    expiration: string;
    equivalentPayout: string;
}

const INITIAL_PERIODS: PeriodState[] = [
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
        type: 'The KL Agreement',
        expiration: 'May 2026 – April 2027',
        hoursAvailable: 37,
        equivalentPayout: '5,550 DKK after tax',
    },
];
// Reusable mock periods matching the user view
const EMPLOYEE_PERIODS = [
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
        type: 'The KL Agreement',
        expiration: 'May 2026 – April 2027',
        hoursAvailable: 37,
        equivalentPayout: '5,550 DKK after tax',
    },
];

// Reusable mock contracts matching the contracts view
const EMPLOYEE_CONTRACTS: ContractDto[] = [
    {
        id: 'c-future',
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
        id: 'c-current',
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
    {
        id: 'c-prev',
        badgeLabel: 'PREVIOUS CONTRACT',
        dateRange: 'January 1, 2025 – December 31, 2025',
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

const INITIAL_REQUESTS: PendingRequestDto[] = [
    {
        id: 'req-1',
        dates: 'June 3–5, 2026',
        submittedDate: 'Submitted May 18, 2026',
        durationDays: 3,
        hours: 22.5,
    },
];

interface EmployeeProfileViewProps {
    role?: string;
}

export function EmployeeProfileView({role}: EmployeeProfileViewProps): JSX.Element {
    const isSystemOwner = role === 'SYSTEM OWNER';
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [employee, setEmployee] = useState<UserDto>({
        id: id || 'user-1',
        initials: 'AJ',
        fullName: 'Anna Jensen',
        role: 'EMPLOYEE',
        pendingRequestsCount: 1,
        status: 'needs-attention',
    });

    const [periods, setPeriods] = useState<PeriodState[]>(INITIAL_PERIODS);
    const [requests, setRequests] = useState<PendingRequestDto[]>(INITIAL_REQUESTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<UserDto | null>(null);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [contracts, setContracts] = useState<ContractDto[]>(EMPLOYEE_CONTRACTS);
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [contractToEdit, setContractToEdit] = useState<ContractDto | null>(null);

    const handleApprove = (reqId: string) => {
        alert(`Approved request ${reqId}`);
        setRequests((prev) => prev.filter((r) => r.id !== reqId));
    };

    const handleReject = (reqId: string) => {
        alert(`Rejected request ${reqId}`);
        setRequests((prev) => prev.filter((r) => r.id !== reqId));
    };

    const handleEditUser = () => {
        setUserToEdit(employee);
        setIsModalOpen(true);
    };

    const handleSaveUser = ({firstName, lastName}: { firstName: string; lastName: string }) => {
        const fullName = `${firstName} ${lastName}`;
        const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

        setEmployee((prev) => ({
            ...prev,
            fullName,
            initials,
        }));

        setIsModalOpen(false);
        
    
};

    const handleTransferHours = ({
                                     fromId,
                                     toId,
                                     hours,
                                 }: {
        fromId: string;
        toId: string;
        hours: number;
    }) => {
        setPeriods((prev) =>
            prev.map((p) => {
                if (p.id === fromId) {
                    return { ...p, hoursAvailable: Math.max(0, p.hoursAvailable - hours) };
                }
                if (p.id === toId) {
                    return { ...p, hoursAvailable: p.hoursAvailable + hours };
                }
                return p;
            })
        );
    };

    const handleOpenAddContract = () => {
setContractToEdit(null);
    setIsContractModalOpen(true);};

    const handleOpenEditContract = (contract: ContractDto) => {
        setContractToEdit(contract);
        setIsContractModalOpen(true);
    };

    const handleSaveContract = (savedContract: ContractDto) => {
        if (contractToEdit) {
            setContracts((prev) =>
                prev.map((c) => (c.id === savedContract.id ? savedContract : c))
            );
        } else {
            setContracts((prev) => [savedContract, ...prev]);
        }
        setIsContractModalOpen(false);
    };
    
    

    return (
        <div className="profile-page-wrapper">
            <main className="profile-container">
                {/* Back Link */}
                <button
                    type="button"
                    className="back-nav-btn"
                    onClick={() => navigate('/users')}
                >
                    ‹ TEAM MANAGEMENT
                </button>

                {/* Header */}
                <header className="profile-header">
                    <span className="profile-eyebrow">EMPLOYEE VACATION BANK</span>
                    <div className="profile-name-row">
                        <h1 className="profile-title">{employee.fullName}</h1>

                        {
                            isSystemOwner && (
                                <button
                            type="button"
                            className="btn-edit-inline"
                            onClick={handleEditUser}
                            aria-label="Edit employee name"
                        >
                            ✏️
                        </button> )}
                    </div>
                    <p className="profile-subtitle">
                        Review available holiday periods, balances, and requests awaiting a decision.
                    </p>
                </header>

                {/* 1. Pending Vacation Requests Panel */}
                {!isSystemOwner && (
                    <RequestsPanel
                    requests={requests}
                    onApprove={handleApprove}
                    onReject={handleReject}
                /> )}

                {/* 2. Available Holiday Periods Section */}
                <section className="profile-section" aria-label="Available holiday periods">
                    <div className="section-title-row">
                        <span className="section-eyebrow">VACATION BANK</span>
                        <div className="section-heading-with-actions">
                            <h2 className="section-title">Available holiday periods</h2>
                            {!isSystemOwner && (
                            <button
                                type="button"
                                className="btn-edit-inline"
                                onClick={() => setIsTransferModalOpen(true)}
                                aria-label="Transfer vacation days"
                            >
                                ✏️
                            </button> )}
                        </div>
                    </div>

                    <div className="cards-three-grid">
                        {EMPLOYEE_PERIODS.map((period) => (
                            <HolidayCard
                                key={period.id}
                                periodRange={period.periodRange}
                                type={period.type}
                                expiration={period.expiration}
                                hoursAvailable={period.hoursAvailable}
                                equivalentPayout={period.equivalentPayout}
                            />
                        ))}
                    </div>
                </section>

                {/* 3. Contracts Section */}
                <section className="profile-section" aria-label="Contracts">
                    <div className="section-title-row">
                        <span className="section-eyebrow">EMPLOYMENT</span>
                        <div className="section-heading-with-actions">
                            <h2 className="section-title">Contracts</h2>
                            {isSystemOwner && (
                            <button
                                type="button"
                                className="btn-add-circle"
                                onClick={handleOpenAddContract}
                                aria-label="Add contract"
                            >
                                +
                            </button> )}
                        </div>
                    </div>

                    <div className="cards-three-grid">
                        {EMPLOYEE_CONTRACTS.map((contract) => (
                            <ContractCard key={contract.id} contract={contract}
                            onEdit={isSystemOwner? handleOpenEditContract : undefined}/>
                        ))}
                    </div>
                </section>
            </main>

            {isSystemOwner && (
            <UserModal
                isOpen={isModalOpen}
                userToEdit={userToEdit}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUser}
            /> )}

            {!isSystemOwner && (
           <TransferVacationModal
                isOpen={isTransferModalOpen}
                periods={periods}
                onClose={() => setIsTransferModalOpen(false)}
                onTransfer={handleTransferHours}
            /> )}

            {isSystemOwner && (
            <ContractModal
                isOpen={isContractModalOpen}
                contractToEdit={contractToEdit}
                onClose={() => {
                    setIsContractModalOpen(false);
                setContractToEdit(null);}}
                onSave={handleSaveContract}
            /> )}
        </div>
    );
}