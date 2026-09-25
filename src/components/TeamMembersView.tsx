import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, UserPlus, Shield, Trash2, ShieldAlert } from 'lucide-react';
import { Role } from '../types/domain';
import { InviteMemberSchema } from '../lib/schemas';

export const TeamMembersView: React.FC = () => {
  const { members, inviteMember, removeMember, canManageTeam, currentRole, currentOrg } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Role>('operator');
  const [formError, setFormError] = useState<string | null>(null);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validation = InviteMemberSchema.safeParse({ email, fullName, role });
    if (!validation.success) {
      setFormError(validation.error.errors[0]?.message || 'Validation error');
      return;
    }

    const res = inviteMember(email, fullName, role);
    if (!res.success) {
      setFormError(res.error || 'Failed to invite member');
      return;
    }

    setIsModalOpen(false);
    setEmail('');
    setFullName('');
    setRole('operator');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Team Access & RBAC Controls</h1>
          <p className="page-subtitle">
            Manage organization members for {currentOrg.name}. Roles enforce explicit execution boundaries across operations and billing.
          </p>
        </div>

        {canManageTeam ? (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <UserPlus size={16} />
            <span>Invite Team Member</span>
          </button>
        ) : (
          <button className="btn btn-secondary" disabled title="Only Owners can manage organization members">
            <ShieldAlert size={16} />
            <span>Invite Member (Owner Only)</span>
          </button>
        )}
      </div>

      {!canManageTeam && (
        <div className="alert-box alert-warning">
          <ShieldAlert size={18} />
          <div>
            <strong>Access Restricted:</strong> Modifying organization memberships requires the <strong>Owner</strong> role. Your simulated role is <strong>{currentRole}</strong>.
          </div>
        </div>
      )}

      {/* Role Definitions Card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title">
          <span>Role Permissions Matrix</span>
          <Shield size={16} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 12 }}>
          <div style={{ padding: 12, backgroundColor: 'var(--bg-app)', borderRadius: 6 }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>👑 Owner</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              Full authority. Manages subscriptions, team invites, data exports, and connector secrets.
            </div>
          </div>
          <div style={{ padding: 12, backgroundColor: 'var(--bg-app)', borderRadius: 6 }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>💼 Manager</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              Operational control. Updates business rules, configures services, reviews approvals, and publishes workflows.
            </div>
          </div>
          <div style={{ padding: 12, backgroundColor: 'var(--bg-app)', borderRadius: 6 }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>🎧 Operator</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              Customer communications. Replies in inbox, resolves exceptions. Strictly blocked from billing and publishing.
            </div>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="table-container">
        <div className="table-header-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} style={{ color: 'var(--text-muted)' }} />
            <h2 className="table-heading">Active Members ({members.length})</h2>
          </div>
          <span className="badge badge-neutral">Tenant Scoped</span>
        </div>

        <table className="neat-table">
          <thead>
            <tr>
              <th>Member Name & Email</th>
              <th>Assigned Role</th>
              <th>Membership ID</th>
              <th>Joined Date</th>
              {canManageTeam && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{m.user.fullName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.user.email}</div>
                </td>
                <td>
                  {m.role === 'owner' && <span className="badge badge-neutral">Owner</span>}
                  {m.role === 'manager' && <span className="badge badge-success">Manager</span>}
                  {m.role === 'operator' && <span className="badge badge-warning">Operator</span>}
                </td>
                <td>
                  <code style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.id}</code>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>
                  {new Date(m.createdAt).toLocaleDateString()}
                </td>
                {canManageTeam && (
                  <td>
                    {m.role !== 'owner' && (
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '4px 8px' }} 
                        onClick={() => removeMember(m.id)}
                        title="Remove Member"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>Invite Team Member</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <form onSubmit={handleInvite}>
              <div className="modal-body">
                {formError && <div className="alert-box alert-warning">{formError}</div>}
                
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={fullName} onChange={e => setFullName(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Role Assignment</label>
                  <select className="select-input" style={{ width: '100%' }} value={role} onChange={e => setRole(e.target.value as Role)}>
                    <option value="operator">Operator (Inquiries & Takeover Only)</option>
                    <option value="manager">Manager (Services & Workflow Operations)</option>
                    <option value="owner">Owner (Full Administration)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Send Invitation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
