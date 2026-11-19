import '../css/card.css';

export interface UserDto {
    id: string;
    initials: string;
    avatarBgColor?: string;
    avatarTextColor?: string;
    role: string;
    fullName: string;
    pendingRequestsCount: number;
    status: 'on-track' | 'needs-attention'; // 'on-track' = green check, 'needs-attention' = salmon exclamation
}

interface UserCardProps {
    user: UserDto;
    onOpenProfile?: (id: string) => void;
}

export function UserCard({ user, onOpenProfile }: UserCardProps) {
    const isNeedsAttention = user.status === 'needs-attention';

    return (
        <article className="user-card">
            <div className="user-card-body">
                {/* Left Side: Avatar + Details */}
                <div className="user-details-group">
                    <div
                        className="user-avatar"
                        style={{
                            backgroundColor: user.avatarBgColor || (isNeedsAttention ? '#f6e4df' : '#e6edf5'),
                            color: user.avatarTextColor || (isNeedsAttention ? '#b75b4b' : '#3d5269'),
                        }}
                    >
                        {user.initials}
                    </div>

                    <div className="user-info-text">
                        <span className="user-role-label">{user.role}</span>
                        <div className="user-name-row">
                            <h3 className="user-name-heading">{user.fullName}</h3>
                        </div>
                    </div>
                </div>

                {/* Right Side: Status Badge */}
                <div className="user-status-slot">
                    {isNeedsAttention ? (
                        <span className="status-badge-circle status-alert" title="Expiring days need to be planned">
              !
            </span>
                    ) : (
                        <span className="status-badge-circle status-check" title="Vacation plan on track">
              ✓
            </span>
                    )}
                </div>
            </div>

            {/* Card Footer: Requests count + Open profile action */}
            <footer className="user-card-footer">
        <span className={`pending-count-label ${user.pendingRequestsCount > 0 ? 'has-pending' : ''}`}>
          {user.pendingRequestsCount > 0
              ? `${user.pendingRequestsCount} PENDING REQUEST${user.pendingRequestsCount > 1 ? 'S' : ''}`
              : 'NO PENDING REQUESTS'}
        </span>

                <button
                    type="button"
                    className="btn-open-profile"
                    onClick={() => onOpenProfile?.(user.id)}
                >
                    <span>OPEN PROFILE</span>
                    <span className="chevron-arrow" aria-hidden="true">›</span>
                </button>
            </footer>
        </article>
    );
}