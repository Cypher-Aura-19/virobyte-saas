import React, { useState } from 'react';
import { useApp, SecurityAuditReport } from '../context/AppContext';
import { ShieldCheck, Play, CheckCircle2, XCircle, Lock, RefreshCw, KeyRound, Database } from 'lucide-react';

export const TenantSecurityView: React.FC = () => {
  const { runSecurityAudit, currentOrg, currentRole } = useApp();
  const [report, setReport] = useState<SecurityAuditReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunAudit = () => {
    setIsRunning(true);
    setTimeout(() => {
      const results = runSecurityAudit();
      setReport(results);
      setIsRunning(false);
    }, 400);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tenant Isolation & Security Suite</h1>
          <p className="page-subtitle">
            Sprint 1 Acceptance Verification: Automated validation of Row-Level Security (RLS), RBAC barriers, and tenant boundaries.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleRunAudit} disabled={isRunning}>
          {isRunning ? <RefreshCw size={16} className="spin-icon" /> : <Play size={16} />}
          <span>{report ? 'Re-run Security Audit' : 'Run Security Audit'}</span>
        </button>
      </div>

      {/* Security Context Banner */}
      <div className="card" style={{ marginBottom: 24, backgroundColor: 'var(--bg-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ShieldCheck size={28} style={{ color: 'var(--accent-blue)' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>
              Active Isolation Scope: <span style={{ color: 'var(--text-main)' }}>{currentOrg.name} ({currentOrg.id})</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              PostgreSQL RLS policies restrict all table scans to matching <code>org_id</code> tokens. Service tokens never leak across organization contexts.
            </div>
          </div>
        </div>
      </div>

      {/* Audit Report Results */}
      {report ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              Audit Completed at {report.timestamp} — {report.passedChecks} of {report.totalChecks} Checks Passed
            </div>
            {report.passedChecks === report.totalChecks ? (
              <span className="badge badge-success">
                <CheckCircle2 size={12} /> All Boundaries Secure
              </span>
            ) : (
              <span className="badge badge-danger">
                <XCircle size={12} /> Policy Violation Detected
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {report.results.map((check, idx) => (
              <div key={idx} className="card" style={{ borderLeft: check.passed ? '4px solid #059669' : '4px solid #dc2626' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {check.passed ? (
                        <CheckCircle2 size={18} style={{ color: '#059669' }} />
                      ) : (
                        <XCircle size={18} style={{ color: '#dc2626' }} />
                      )}
                      <h3 style={{ fontSize: 15, fontWeight: 600 }}>{check.name}</h3>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, marginLeft: 26 }}>
                      {check.description}
                    </p>
                  </div>
                  <span className={`badge ${check.passed ? 'badge-success' : 'badge-danger'}`}>
                    {check.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>

                <div style={{ marginTop: 12, marginLeft: 26, padding: 10, backgroundColor: 'var(--bg-app)', borderRadius: 6, fontSize: 12 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Evidence: </span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-main)' }}>{check.evidence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Database size={40} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>Automated Verification Suite Ready</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 460, margin: '8px auto 20px' }}>
            Click "Run Security Audit" above to test tenant boundary isolation, RLS filters, role access barriers, and minor unit integer compliance in real time.
          </p>
          <button className="btn btn-secondary" onClick={handleRunAudit}>
            <Play size={14} /> Execute Suite
          </button>
        </div>
      )}
    </div>
  );
};
