import React from 'react';
import { useApp } from '../context/AppContext';
import { FileText, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs, currentOrg } = useApp();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Immutable Audit Trail</h1>
          <p className="page-subtitle">
            Tenant: <strong>{currentOrg.name}</strong> • Records all sensitive modifications, role updates, and configuration version changes.
          </p>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={18} style={{ color: 'var(--text-muted)' }} />
            <h2 className="table-heading">Logged Events ({auditLogs.length})</h2>
          </div>
          <span className="badge badge-neutral">Tenant Scoped</span>
        </div>

        {auditLogs.length === 0 ? (
          <div className="empty-state">
            <Clock className="empty-icon" />
            <h3 className="empty-title">No audit events recorded</h3>
            <p className="empty-desc">Any changes to services, settings, or memberships will appear here automatically.</p>
          </div>
        ) : (
          <table className="neat-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor & Role</th>
                <th>Action & Entity</th>
                <th>Event Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)', fontSize: 13 }}>
                    {new Date(log.occurredAt).toLocaleString()}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{log.actorName}</div>
                    <span className="badge badge-neutral" style={{ fontSize: 11, padding: '1px 6px' }}>
                      {log.actorRole}
                    </span>
                  </td>
                  <td>
                    <code style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>
                      {log.action}
                    </code>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {log.entityType} ({log.entityId.slice(0, 10)}...)
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-main)', fontSize: 13 }}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
