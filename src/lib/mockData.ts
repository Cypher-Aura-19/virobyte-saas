import { Organization, User, Membership, Service, BusinessConfig, AuditEvent, ConnectorBinding, UsageMetric } from '../types/domain';

export const INITIAL_ORGS: Organization[] = [
  {
    id: 'org_sparkle_01',
    name: 'Sparkle & Shine Cleaning Co.',
    slug: 'sparkle-shine-nyc',
    timezone: 'America/New_York',
    currency: 'USD',
    status: 'active',
    createdAt: '2026-09-01T09:00:00Z',
  },
  {
    id: 'org_apex_02',
    name: 'Apex Facility & Commercial Services',
    slug: 'apex-commercial-atx',
    timezone: 'America/Chicago',
    currency: 'USD',
    status: 'active',
    createdAt: '2026-09-10T14:30:00Z',
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user_dursun',
    email: 'dursun@virobyte.dev',
    fullName: 'Dursun Kaplica',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: 'user_sarah',
    email: 'sarah.m@sparkleshine.com',
    fullName: 'Sarah Miller',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: 'user_alex',
    email: 'alex.r@sparkleshine.com',
    fullName: 'Alex Rivera',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: 'user_support',
    email: 'support@virobyte.com',
    fullName: 'Platform Auditor',
  },
];

export const INITIAL_MEMBERSHIPS: Membership[] = [
  // Sparkle & Shine members
  { id: 'mem_1', orgId: 'org_sparkle_01', userId: 'user_dursun', role: 'owner', createdAt: '2026-09-01T09:00:00Z' },
  { id: 'mem_2', orgId: 'org_sparkle_01', userId: 'user_sarah', role: 'manager', createdAt: '2026-09-03T11:00:00Z' },
  { id: 'mem_3', orgId: 'org_sparkle_01', userId: 'user_alex', role: 'operator', createdAt: '2026-09-05T08:30:00Z' },
  
  // Apex Facility members
  { id: 'mem_4', orgId: 'org_apex_02', userId: 'user_dursun', role: 'owner', createdAt: '2026-09-10T14:30:00Z' },
  { id: 'mem_5', orgId: 'org_apex_02', userId: 'user_alex', role: 'operator', createdAt: '2026-09-12T09:15:00Z' },
];

export const INITIAL_SERVICES: Service[] = [
  // Sparkle & Shine services
  {
    id: 'srv_spk_01',
    orgId: 'org_sparkle_01',
    name: 'Standard Apartment Cleaning',
    description: 'Routine maintenance clean including dusting, vacuuming, kitchen counters, and bathroom sanitation.',
    durationMinutes: 120,
    bufferMinutes: 30,
    priceMinor: 14000, // $140.00
    allowedAreas: ['Manhattan', 'Brooklyn Heights', 'Williamsburg'],
    active: true,
    configVersion: 1,
    createdAt: '2026-09-02T10:00:00Z',
  },
  {
    id: 'srv_spk_02',
    orgId: 'org_sparkle_01',
    name: 'Deep Sanitation & Scrub',
    description: 'Comprehensive deep cleaning inside kitchen appliances, baseboards, deep tile grout, and window sills.',
    durationMinutes: 240,
    bufferMinutes: 45,
    priceMinor: 28000, // $280.00
    allowedAreas: ['Manhattan', 'Brooklyn Heights', 'Williamsburg', 'Queens (Astoria)'],
    active: true,
    configVersion: 1,
    createdAt: '2026-09-02T10:30:00Z',
  },
  {
    id: 'srv_spk_03',
    orgId: 'org_sparkle_01',
    name: 'Move-in / Move-out Turnover',
    description: 'Empty home complete scrub down meeting landlord deposit return inspection guidelines.',
    durationMinutes: 300,
    bufferMinutes: 60,
    priceMinor: 35000, // $350.00
    allowedAreas: ['Manhattan', 'Brooklyn Heights'],
    active: true,
    configVersion: 1,
    createdAt: '2026-09-03T14:00:00Z',
  },

  // Apex Facility services (Different tenant!)
  {
    id: 'srv_apx_01',
    orgId: 'org_apex_02',
    name: 'Commercial Office Floor Care',
    description: 'Nightly commercial trash removal, vacuuming, and hard floor machine buffing for offices up to 5,000 sq ft.',
    durationMinutes: 180,
    bufferMinutes: 30,
    priceMinor: 45000, // $450.00
    allowedAreas: ['Downtown Austin', 'Domain Tech Park', 'Round Rock'],
    active: true,
    configVersion: 1,
    createdAt: '2026-09-11T12:00:00Z',
  },
  {
    id: 'srv_apx_02',
    orgId: 'org_apex_02',
    name: 'Post-Construction Rough & Final Clean',
    description: 'Debris removal, paint spot scraper, HEPA vacuum filtration, and industrial dust removal.',
    durationMinutes: 360,
    bufferMinutes: 60,
    priceMinor: 95000, // $950.00
    allowedAreas: ['Austin Metro Area'],
    active: true,
    configVersion: 1,
    createdAt: '2026-09-12T16:00:00Z',
  },
];

export const INITIAL_CONFIGS: Record<string, BusinessConfig> = {
  org_sparkle_01: {
    id: 'cfg_spk_01',
    orgId: 'org_sparkle_01',
    version: 3,
    businessName: 'Sparkle & Shine Cleaning Co.',
    publicContactPhone: '+1 (555) 234-8921',
    publicContactEmail: 'hello@sparkleshine.com',
    timezone: 'America/New_York',
    currency: 'USD',
    schedule: {
      monday: { enabled: true, intervals: [{ open: '08:30', close: '18:00' }] },
      tuesday: { enabled: true, intervals: [{ open: '08:30', close: '18:00' }] },
      wednesday: { enabled: true, intervals: [{ open: '08:30', close: '18:00' }] },
      thursday: { enabled: true, intervals: [{ open: '08:30', close: '18:00' }] },
      friday: { enabled: true, intervals: [{ open: '08:30', close: '18:00' }] },
      saturday: { enabled: true, intervals: [{ open: '09:00', close: '16:00' }] },
      sunday: { enabled: false, intervals: [] },
    },
    minNoticeHours: 24,
    maxHorizonDays: 30,
    cancellationPolicyHours: 24,
    escalationKeywords: ['complaint', 'refund', 'manager', 'speak to a human', 'damage', 'discount'],
    faqs: [
      { question: 'Do you bring your own cleaning supplies?', answer: 'Yes, our team brings all eco-friendly supplies and HEPA vacuums.' },
      { question: 'What if I need to cancel?', answer: 'Cancellations with at least 24 hours notice are fully refunded.' },
    ],
    tone: 'friendly',
    requireHumanApprovalForBookings: false,
    status: 'published',
    updatedAt: '2026-09-20T11:20:00Z',
    updatedBy: 'user_dursun',
  },
  org_apex_02: {
    id: 'cfg_apx_01',
    orgId: 'org_apex_02',
    version: 1,
    businessName: 'Apex Facility & Commercial Services',
    publicContactPhone: '+1 (512) 800-4491',
    publicContactEmail: 'ops@apexservices.com',
    timezone: 'America/Chicago',
    currency: 'USD',
    schedule: {
      monday: { enabled: true, intervals: [{ open: '18:00', close: '23:30' }] },
      tuesday: { enabled: true, intervals: [{ open: '18:00', close: '23:30' }] },
      wednesday: { enabled: true, intervals: [{ open: '18:00', close: '23:30' }] },
      thursday: { enabled: true, intervals: [{ open: '18:00', close: '23:30' }] },
      friday: { enabled: true, intervals: [{ open: '18:00', close: '23:30' }] },
      saturday: { enabled: false, intervals: [] },
      sunday: { enabled: false, intervals: [] },
    },
    minNoticeHours: 48,
    maxHorizonDays: 60,
    cancellationPolicyHours: 48,
    escalationKeywords: ['custom quote', 'procurement', 'invoice', 'insurance certificate'],
    faqs: [
      { question: 'Are you bonded and insured?', answer: 'Yes, Apex is fully bonded and carries $2M general liability coverage.' },
    ],
    tone: 'professional',
    requireHumanApprovalForBookings: true,
    status: 'published',
    updatedAt: '2026-09-14T08:00:00Z',
    updatedBy: 'user_dursun',
  },
};

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud_01',
    orgId: 'org_sparkle_01',
    actorUserId: 'user_dursun',
    actorName: 'Dursun Kaplica',
    actorRole: 'owner',
    action: 'SERVICE_CREATED',
    entityType: 'service',
    entityId: 'srv_spk_03',
    details: 'Created Move-in / Move-out Turnover ($350.00)',
    occurredAt: '2026-09-21T09:12:00Z',
  },
  {
    id: 'aud_02',
    orgId: 'org_sparkle_01',
    actorUserId: 'user_sarah',
    actorName: 'Sarah Miller',
    actorRole: 'manager',
    action: 'CONFIG_PUBLISHED',
    entityType: 'business_config',
    entityId: 'cfg_spk_01',
    details: 'Published configuration v3: updated Saturday hours to 09:00 - 16:00',
    occurredAt: '2026-09-20T11:20:00Z',
  },
  {
    id: 'aud_03',
    orgId: 'org_sparkle_01',
    actorUserId: 'user_dursun',
    actorName: 'Dursun Kaplica',
    actorRole: 'owner',
    action: 'MEMBER_INVITED',
    entityType: 'membership',
    entityId: 'mem_3',
    details: 'Granted Operator role to alex.r@sparkleshine.com',
    occurredAt: '2026-09-18T14:45:00Z',
  },
  {
    id: 'aud_04',
    orgId: 'org_apex_02',
    actorUserId: 'user_dursun',
    actorName: 'Dursun Kaplica',
    actorRole: 'owner',
    action: 'SERVICE_CREATED',
    entityType: 'service',
    entityId: 'srv_apx_01',
    details: 'Created Commercial Office Floor Care ($450.00)',
    occurredAt: '2026-09-15T10:00:00Z',
  },
];

export const INITIAL_CONNECTORS: Record<string, ConnectorBinding[]> = {
  org_sparkle_01: [
    { 
      provider: 'whatsapp', 
      name: 'WhatsApp Business API', 
      status: 'connected', 
      accountIdentifier: '+1 (555) 234-8921 (Twilio ISV)', 
      whatsappPhoneNumberId: 'phone_num_92182049',
      webhookSecretRef: 'sec_wh_sparkle_prod',
      lastChecked: '2 min ago' 
    },
    { 
      provider: 'google_calendar', 
      name: 'Google Calendar (Bookings)', 
      status: 'connected', 
      accountIdentifier: 'dispatch@sparkleshine.com', 
      selectedCalendarId: 'c_sparkle_cleaning_dispatch@group.calendar.google.com',
      lastChecked: '12 min ago' 
    },
    { 
      provider: 'google_sheets', 
      name: 'Google Sheets (Lead Mirror)', 
      status: 'connected', 
      accountIdentifier: 'Active Leads 2026 (Sheet ID: 1a9B..)', 
      selectedSheetId: '1a9B7cK90xZ893LkD21_sparkle_leads',
      selectedSheetTab: 'New Inquiries',
      lastChecked: '45 min ago' 
    },
    { 
      provider: 'resend', 
      name: 'Staff Alert Email (Resend)', 
      status: 'connected', 
      accountIdentifier: 'alerts.sparkleshine.com (SPF/DKIM verified)', 
      alertEmailRecipient: 'sarah.m@sparkleshine.com',
      lastChecked: 'Just now' 
    },
  ],
  org_apex_02: [
    { 
      provider: 'whatsapp', 
      name: 'WhatsApp Business API', 
      status: 'pending', 
      details: 'Awaiting Meta Business Manager verification', 
      lastChecked: '1 day ago' 
    },
    { 
      provider: 'google_calendar', 
      name: 'Google Calendar (Bookings)', 
      status: 'connected', 
      accountIdentifier: 'austin-ops@apexservices.com', 
      selectedCalendarId: 'austin_crew_commercial@apexservices.com',
      lastChecked: '3 hours ago' 
    },
    { 
      provider: 'google_sheets', 
      name: 'Google Sheets (Lead Mirror)', 
      status: 'disconnected', 
      details: 'OAuth token revoked; needs reconnection', 
      lastChecked: '5 hours ago' 
    },
    { 
      provider: 'resend', 
      name: 'Staff Alert Email (Resend)', 
      status: 'connected', 
      accountIdentifier: 'notifications@apexservices.com', 
      alertEmailRecipient: 'dispatch@apexservices.com',
      lastChecked: '1 hour ago' 
    },
  ],
};

export const INITIAL_USAGE: Record<string, UsageMetric> = {
  org_sparkle_01: {
    messagesThisMonth: 842,
    messagesCap: 2500,
    appointmentsBooked: 38,
    leadsCaptured: 74,
    staffHoursSaved: 28.5,
    activeWorkflows: 3,
    activeWorkflowsCap: 5,
  },
  org_apex_02: {
    messagesThisMonth: 124,
    messagesCap: 1000,
    appointmentsBooked: 6,
    leadsCaptured: 19,
    staffHoursSaved: 7.2,
    activeWorkflows: 1,
    activeWorkflowsCap: 2,
  },
};
