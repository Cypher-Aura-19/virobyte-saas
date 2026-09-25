export type Role = 'owner' | 'manager' | 'operator' | 'platform_support';

export type OrganizationStatus = 'active' | 'trialing' | 'past_due' | 'suspended';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  currency: string;
  status: OrganizationStatus;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export interface Membership {
  id: string;
  orgId: string;
  userId: string;
  role: Role;
  createdAt: string;
}

export interface Service {
  id: string;
  orgId: string;
  name: string;
  description: string;
  durationMinutes: number;
  bufferMinutes: number;
  priceMinor: number; // in cents/minor units (e.g. 14000 = $140.00)
  allowedAreas: string[];
  active: boolean;
  configVersion: number;
  createdAt: string;
}

export interface WorkingHourInterval {
  open: string;
  close: string;
}

export interface WeeklySchedule {
  monday: { enabled: boolean; intervals: WorkingHourInterval[] };
  tuesday: { enabled: boolean; intervals: WorkingHourInterval[] };
  wednesday: { enabled: boolean; intervals: WorkingHourInterval[] };
  thursday: { enabled: boolean; intervals: WorkingHourInterval[] };
  friday: { enabled: boolean; intervals: WorkingHourInterval[] };
  saturday: { enabled: boolean; intervals: WorkingHourInterval[] };
  sunday: { enabled: boolean; intervals: WorkingHourInterval[] };
}

export interface BusinessConfig {
  id: string;
  orgId: string;
  version: number;
  businessName: string;
  publicContactPhone: string;
  publicContactEmail: string;
  timezone: string;
  currency: string;
  schedule: WeeklySchedule;
  minNoticeHours: number;
  maxHorizonDays: number;
  cancellationPolicyHours: number;
  escalationKeywords: string[];
  faqs: Array<{ question: string; answer: string }>;
  tone: 'professional' | 'friendly' | 'concise';
  requireHumanApprovalForBookings: boolean;
  status: 'draft' | 'published';
  updatedAt: string;
  updatedBy: string;
}

export interface AuditEvent {
  id: string;
  orgId: string;
  actorUserId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  entityType: 'service' | 'business_config' | 'membership' | 'connection' | 'billing' | 'simulator';
  entityId: string;
  details: string;
  occurredAt: string;
}

export type ConnectorStatus = ConnectorBinding;

export interface ConnectorBinding {
  provider: 'whatsapp' | 'google_calendar' | 'google_sheets' | 'resend';
  name: string;
  status: 'connected' | 'disconnected' | 'degraded' | 'pending';
  accountIdentifier?: string;
  details?: string;
  lastChecked: string;
  // Provider-specific destinations
  selectedCalendarId?: string;
  selectedSheetId?: string;
  selectedSheetTab?: string;
  alertEmailRecipient?: string;
  whatsappPhoneNumberId?: string;
  webhookSecretRef?: string;
}

export interface UsageMetric {
  messagesThisMonth: number;
  messagesCap: number;
  appointmentsBooked: number;
  leadsCaptured: number;
  staffHoursSaved: number;
  activeWorkflows: number;
  activeWorkflowsCap: number;
}

// Sprint 2: Simulator Types
export interface SimulatorChatMessage {
  id: string;
  sender: 'customer' | 'bot' | 'system';
  text: string;
  timestamp: string;
  status?: 'delivered' | 'read' | 'pending';
}

export interface ActionLedgerEntry {
  id: string;
  operationKey: string;
  nodeType: 'extract_fields' | 'validate_rules' | 'reserve_calendar_slot' | 'upsert_google_sheet' | 'send_staff_email' | 'escalate_to_human';
  targetDestination: string;
  status: 'simulated_success' | 'simulated_exception' | 'simulated_halt';
  dryRunPayload: Record<string, any>;
  timestamp: string;
}

export interface SimulationTrace {
  runId: string;
  inboundText: string;
  workflowTriggered: 'W1' | 'W2' | 'W3';
  intentDetected: string;
  extractedFields: {
    customerName?: string;
    serviceName?: string;
    area?: string;
    requestedTime?: string;
  };
  ruleEvaluation: {
    serviceSupported: boolean;
    areaPermitted: boolean;
    noticeCompliant: boolean;
    humanEscalationRequired: boolean;
    reason?: string;
  };
  ledgerEntries: ActionLedgerEntry[];
  botResponse: string;
}
