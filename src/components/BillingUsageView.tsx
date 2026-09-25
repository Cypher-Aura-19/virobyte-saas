import React from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, ShieldAlert, CheckCircle, BarChart3, Receipt, ArrowUpRight } from 'lucide-react';

export const BillingUsageView: React.FC = () => {
  const { canViewBilling, currentRole, currentOrg, usage } = useApp();

  if (!canViewBilling) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Billing & Subscription</h1>
            <p className="page-subtitle">Manage organization subscription, usage thresholds, and payment methods.</p>
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '60px 24px', maxWidth: 640, margin: '40px auto' }}>
          <ShieldAlert size={48} style={{ color: 'var(--warning-text)', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Financial Access Restricted</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
            Under the Virobyte RBAC model, only the <strong>Organization Owner</strong> has authority to view billing statements, manage credit card payment methods, or modify subscription tiers.
          </p>
          <div style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 6, fontSize: 13, border: '1px solid var(--border-light)' }}>
            Current simulated role: <strong>{currentRole}</strong>
          </div>
          <div style={{ marginTop: 24, fontSize: 12, color: 'var(--text-muted)' }}>
            Switch to the <strong>Owner</strong> role in the top header bar to inspect this tenant's billing details.
          </div>
        </div>
      </div>
    );
  }

  const messageUsagePercent = Math.min(100, Math.round((usage.messagesThisMonth / usage.messagesCap) * 100));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Billing & Operating Economics</h1>
          <p className="page-subtitle">
            Tenant: <strong>{currentOrg.name}</strong> • Active Subscription & Resource Consumption
          </p>
        </div>

        <button className="btn btn-secondary">
          <Receipt size={16} />
          <span>Download Statements</span>
        </button>
      </div>

      {/* Plan Card */}
      <div className="grid-cards">
        <div className="card">
          <div className="card-title">
            <span>Current Subscription Plan</span>
            <span className="badge badge-success">Active Paid Pilot</span>
          </div>
          <div className="stat-number">$149.00 <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>/ month</span></div>
          <div className="stat-subtext">Next renewal date: October 1, 2026 via Stripe</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Unit Contribution Margin</span>
            <BarChart3 size={16} />
          </div>
          <div className="stat-number">~73%</div>
          <div className="stat-subtext">
            $109 net contribution after estimated messaging and compute costs
          </div>
        </div>
      </div>

      {/* Usage Progress */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title">
          <span>Monthly Resource Quotas</span>
          <CreditCard size={16} />
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
            <span>WhatsApp & AI Workflow Invocations</span>
            <span><strong>{usage.messagesThisMonth}</strong> / {usage.messagesCap} ({messageUsagePercent}%)</span>
          </div>
          <div style={{ width: '100%', height: 8, backgroundColor: 'var(--bg-subtle)', borderRadius: 999, overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${messageUsagePercent}%`, 
                height: '100%', 
                backgroundColor: messageUsagePercent > 80 ? 'var(--warning-text)' : 'var(--primary)',
                borderRadius: 999 
              }} 
            />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Hard spending cap: Automations pause and notify owner at 100% of quota.
          </div>
        </div>
      </div>
    </div>
  );
};
