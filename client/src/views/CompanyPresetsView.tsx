import { useEffect, useState } from 'react';
import {Api, type ClosedDayDto} from '../api/Api';
import { PresetCard } from '../components/PresetCard';
import { PresetModal } from '../components/PresetModal';
import type { VacationAgreementResponseDto } from '../api/Api';
import '../css/view.css';
import {ClosedDaysCard} from "../components/ClosedDaysCard.tsx";
import { MyApi } from "../api/client";

export function CompanyPresetsView() {
    const [agreements, setAgreements] = useState<VacationAgreementResponseDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [closedDays, setClosedDays] = useState<ClosedDayDto[]>([]);
    const [closedDaysLoading, setClosedDaysLoading] = useState<boolean>(true);

    const [selectedAgreement, setSelectedAgreement] = useState<VacationAgreementResponseDto | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadAgreements = async () => {
        try {
            setLoading(true);
            setErrorMessage(null);
            const res = await MyApi.api.presetsGetAgreements();
            setAgreements(res.data);
        } catch (err: any) {
            setErrorMessage(err?.detail || err?.title || 'Failed to load vacation agreements.');
        } finally {
            setLoading(false);
        }
    };

    const loadClosedDays = async () => {
        try {
            setClosedDaysLoading(true);
            const res = await MyApi.api.presetsGetClosedDays();
            const sorted = (Array.isArray(res.data) ? res.data : []).sort(
                (a, b) => new Date(a.date ?? '').getTime() - new Date(b.date ?? '').getTime()
            );
            setClosedDays(sorted);
        } catch (err: any) {
            console.error('Failed to load closed days:', err);
            setClosedDays([]);
        } finally {
            setClosedDaysLoading(false);
        }
    };
    
    useEffect(() => {
        loadAgreements();
        loadClosedDays();
    }, []);

    const handleAddAgreement = () => {
        setSelectedAgreement(null);
        setIsModalOpen(true);
    };

    const handleEditAgreement = (agreement: VacationAgreementResponseDto) => {
        setSelectedAgreement(agreement);
        setIsModalOpen(true);
    };

    const handleDeleteAgreement = async (agreement: VacationAgreementResponseDto) => {
        if (!agreement.id) return;
        if (agreement.isMandatory) {
            alert('Mandatory policies cannot be deleted.');
            return;
        }

        const confirmed = window.confirm(`Are you sure you want to delete "${agreement.title}"?`);
        if (!confirmed) return;

        try {
            await MyApi.api.presetsDeleteAgreement({ id: agreement.id });
            await loadAgreements(); // Reload in place
        } catch (err: any) {
            alert(err?.detail || err?.title || 'Failed to delete agreement.');
        }
    };

    return (
        <div className="profile-page-wrapper">
            <main className="profile-container">
                <header className="profile-header">
                    <span className="profile-eyebrow">ADMINISTRATION</span>
                    <h1 className="profile-title">Company presets</h1>
                    <p className="profile-subtitle">
                        Review and configure statutory rules, company vacation policies, and accrual rates.
                    </p>
                </header>

                <section className="profile-section">
                    <ClosedDaysCard
                        closedDays={closedDays}
                        loading={closedDaysLoading}
                        onRefresh={loadClosedDays}
                    />
                </section>

                <section className="profile-section">
                    <PresetCard
                        agreements={agreements}
                        loading={loading}
                        errorMessage={errorMessage}
                        onAddAgreement={handleAddAgreement}
                        onEditAgreement={handleEditAgreement}
                        onDeleteAgreement={handleDeleteAgreement}
                    />
                </section>

                <PresetModal
                    isOpen={isModalOpen}
                    agreement={selectedAgreement}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={loadAgreements} // 2. Direct callback execution
                />
            </main>
        </div>
    );
}