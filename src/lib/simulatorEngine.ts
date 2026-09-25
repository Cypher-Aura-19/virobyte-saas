import { BusinessConfig, Service, ConnectorBinding, SimulationTrace, ActionLedgerEntry } from '../types/domain';

export function runWorkflowSimulation(
  inboundText: string,
  config: BusinessConfig,
  services: Service[],
  connectors: ConnectorBinding[]
): SimulationTrace {
  const runId = `sim_run_${Date.now()}`;
  const lower = inboundText.toLowerCase();
  const timestamp = new Date().toLocaleTimeString();

  // Find destinations from bindings
  const calendarBinding = connectors.find(c => c.provider === 'google_calendar');
  const sheetsBinding = connectors.find(c => c.provider === 'google_sheets');
  const emailBinding = connectors.find(c => c.provider === 'resend');

  // Check 1: Explicit Escalation Trigger (W3)
  const isEscalation = config.escalationKeywords.some(kw => lower.includes(kw.toLowerCase())) ||
    lower.includes('human') || lower.includes('person') || lower.includes('speak to') || lower.includes('broken');

  // Extraction logic (simulating bounded structured AI extraction)
  let detectedServiceName: string | undefined;
  let matchedService: Service | undefined;
  for (const s of services) {
    if (lower.includes(s.name.toLowerCase()) || lower.includes('clean') || lower.includes('scrub') || lower.includes('move')) {
      detectedServiceName = s.name;
      matchedService = s;
      break;
    }
  }
  if (!detectedServiceName && services.length > 0) {
    detectedServiceName = services[0].name;
    matchedService = services[0];
  }

  // Detect Area
  let detectedArea: string | undefined;
  const knownAreas = ['manhattan', 'brooklyn', 'williamsburg', 'queens', 'austin', 'round rock', 'domain'];
  for (const area of knownAreas) {
    if (lower.includes(area)) {
      detectedArea = area.charAt(0).toUpperCase() + area.slice(1);
      break;
    }
  }

  // Detect Customer Name
  let detectedName = 'Customer';
  const nameMatch = inboundText.match(/(?:my name is|i am|this is)\s+([A-Za-z]+)/i);
  if (nameMatch) {
    detectedName = nameMatch[1];
  }

  // Detect Requested Date / Time
  const hasTime = lower.includes('tomorrow') || lower.includes('saturday') || lower.includes('friday') || lower.includes('pm') || lower.includes('am') || lower.includes('at ');
  const requestedTime = hasTime ? (lower.includes('saturday') ? 'Saturday 2:00 PM' : 'Tomorrow 10:00 AM') : undefined;

  const ledgerEntries: ActionLedgerEntry[] = [];

  // Check for Out-of-Area or Unsupported Service Exception (W3)
  let areaPermitted = true;
  if (detectedArea && matchedService) {
    areaPermitted = matchedService.allowedAreas.some(a => a.toLowerCase().includes(detectedArea!.toLowerCase()));
  }

  if (isEscalation || (detectedArea && !areaPermitted)) {
    // Workflow W3 Triggered
    const reason = isEscalation 
      ? 'Customer requested a human agent or used escalation keyword' 
      : `Requested service area "${detectedArea}" is outside authorized coverage: ${matchedService?.allowedAreas.join(', ')}`;

    ledgerEntries.push({
      id: `led_${Date.now()}_1`,
      operationKey: `op_extract_${runId}`,
      nodeType: 'extract_fields',
      targetDestination: 'packages/ai/adapter',
      status: 'simulated_success',
      dryRunPayload: { intent: 'EXCEPTION_DETECTED', customerName: detectedName, service: detectedServiceName, area: detectedArea },
      timestamp,
    });

    ledgerEntries.push({
      id: `led_${Date.now()}_2`,
      operationKey: `op_halt_${runId}`,
      nodeType: 'escalate_to_human',
      targetDestination: 'apps/web/operator-inbox',
      status: 'simulated_exception',
      dryRunPayload: { reason, conversationState: 'PAUSED', priority: 'HIGH', assignedRole: 'operator' },
      timestamp,
    });

    if (emailBinding?.alertEmailRecipient) {
      ledgerEntries.push({
        id: `led_${Date.now()}_3`,
        operationKey: `op_email_${runId}`,
        nodeType: 'send_staff_email',
        targetDestination: `Resend -> ${emailBinding.alertEmailRecipient}`,
        status: 'simulated_success',
        dryRunPayload: { subject: `[Human Action Needed] Inquiry from ${detectedName}`, reason },
        timestamp,
      });
    }

    return {
      runId,
      inboundText,
      workflowTriggered: 'W3',
      intentDetected: 'HUMAN_ESCALATION',
      extractedFields: { customerName: detectedName, serviceName: detectedServiceName, area: detectedArea, requestedTime },
      ruleEvaluation: {
        serviceSupported: !!matchedService,
        areaPermitted,
        noticeCompliant: true,
        humanEscalationRequired: true,
        reason,
      },
      ledgerEntries,
      botResponse: `Thank you for reaching out, ${detectedName}. I have paused automated replies and notified our team (${reason}). One of our operators will respond to you personally shortly.`,
    };
  }

  // Check if booking intent is present (W2)
  if (hasTime || lower.includes('book') || lower.includes('schedule') || lower.includes('appointment')) {
    ledgerEntries.push({
      id: `led_${Date.now()}_1`,
      operationKey: `op_extract_${runId}`,
      nodeType: 'extract_fields',
      targetDestination: 'packages/ai/adapter',
      status: 'simulated_success',
      dryRunPayload: { intent: 'APPOINTMENT_REQUEST', customerName: detectedName, service: detectedServiceName, area: detectedArea, preferredTime: requestedTime },
      timestamp,
    });

    const targetCal = calendarBinding?.selectedCalendarId || 'primary_calendar';
    ledgerEntries.push({
      id: `led_${Date.now()}_2`,
      operationKey: `op_cal_check_${runId}`,
      nodeType: 'reserve_calendar_slot',
      targetDestination: `Google Calendar (Resource: ${targetCal})`,
      status: 'simulated_success',
      dryRunPayload: { 
        service: matchedService?.name, 
        durationMinutes: matchedService?.durationMinutes || 120, 
        bufferMinutes: matchedService?.bufferMinutes || 30,
        proposedSlot: requestedTime || 'Tomorrow 10:00 AM',
        intervalLockStatus: 'ACQUIRED_POSTGRES_LOCK' 
      },
      timestamp,
    });

    const targetSheet = sheetsBinding?.selectedSheetId || 'Active Leads & Bookings 2026';
    ledgerEntries.push({
      id: `led_${Date.now()}_3`,
      operationKey: `op_sheet_sync_${runId}`,
      nodeType: 'upsert_google_sheet',
      targetDestination: `Google Sheets (ID: ${targetSheet})`,
      status: 'simulated_success',
      dryRunPayload: { leadId: `lead_${runId.slice(-6)}`, name: detectedName, status: 'SLOT_PROPOSED', time: requestedTime },
      timestamp,
    });

    return {
      runId,
      inboundText,
      workflowTriggered: 'W2',
      intentDetected: 'APPOINTMENT_BOOKING',
      extractedFields: { customerName: detectedName, serviceName: detectedServiceName, area: detectedArea, requestedTime },
      ruleEvaluation: {
        serviceSupported: true,
        areaPermitted: true,
        noticeCompliant: true,
        humanEscalationRequired: false,
      },
      ledgerEntries,
      botResponse: `Hi ${detectedName}! We have availability for the ${matchedService?.name || 'Cleaning'} ($${((matchedService?.priceMinor || 14000) / 100).toFixed(2)}) on ${requestedTime || 'Tomorrow at 10:00 AM'}. We also have a slot open at 2:30 PM. Would either of these times work for you? Reply YES to confirm!`,
    };
  }

  // Default Standard Inquiry -> Lead Capture (W1)
  ledgerEntries.push({
    id: `led_${Date.now()}_1`,
    operationKey: `op_extract_${runId}`,
    nodeType: 'extract_fields',
    targetDestination: 'packages/ai/adapter',
    status: 'simulated_success',
    dryRunPayload: { intent: 'GENERAL_LEAD_INQUIRY', customerName: detectedName, service: detectedServiceName, area: detectedArea },
    timestamp,
  });

  const targetSheet = sheetsBinding?.selectedSheetId || 'Active Leads & Bookings 2026';
  ledgerEntries.push({
    id: `led_${Date.now()}_2`,
    operationKey: `op_sheet_upsert_${runId}`,
    nodeType: 'upsert_google_sheet',
    targetDestination: `Google Sheets (ID: ${targetSheet} -> Sheet1)`,
    status: 'simulated_success',
    dryRunPayload: { leadId: `lead_${runId.slice(-6)}`, customerName: detectedName, service: detectedServiceName, status: 'NEW_LEAD' },
    timestamp,
  });

  if (emailBinding?.alertEmailRecipient) {
    ledgerEntries.push({
      id: `led_${Date.now()}_3`,
      operationKey: `op_email_notify_${runId}`,
      nodeType: 'send_staff_email',
      targetDestination: `Resend API -> ${emailBinding.alertEmailRecipient}`,
      status: 'simulated_success',
      dryRunPayload: { subject: `New Lead: ${detectedName} - ${detectedServiceName}`, template: 'staff_lead_alert_v1' },
      timestamp,
    });
  }

  return {
    runId,
    inboundText,
    workflowTriggered: 'W1',
    intentDetected: 'LEAD_CAPTURE',
    extractedFields: { customerName: detectedName, serviceName: detectedServiceName, area: detectedArea },
    ruleEvaluation: {
      serviceSupported: true,
      areaPermitted: true,
      noticeCompliant: true,
      humanEscalationRequired: false,
    },
    ledgerEntries,
    botResponse: `Hello ${detectedName}! Thanks for messaging ${config.businessName}. Our ${matchedService?.name || 'Standard Service'} is $${((matchedService?.priceMinor || 14000) / 100).toFixed(2)} and takes about ${matchedService?.durationMinutes || 120} minutes. Would you like to check available slots for this week?`,
  };
}
