import { z } from 'zod';

export const ServiceSchema = z.object({
  name: z.string().min(2, 'Service name must be at least 2 characters').max(80),
  description: z.string().min(5, 'Description must be at least 5 characters').max(300),
  durationMinutes: z.number().int().min(15, 'Minimum duration is 15 minutes').max(720, 'Maximum duration is 12 hours'),
  bufferMinutes: z.number().int().min(0, 'Buffer cannot be negative').max(180, 'Maximum buffer is 3 hours'),
  priceMinor: z.number().int().min(0, 'Price cannot be negative'), // stored in cents
  allowedAreas: z.array(z.string().min(1)).min(1, 'At least one service area must be specified'),
  active: z.boolean().default(true),
});

export type ServiceFormData = z.infer<typeof ServiceSchema>;

export const WorkingHourIntervalSchema = z.object({
  open: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),
  close: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),
}).refine(data => data.open < data.close, {
  message: 'Closing time must be after opening time',
  path: ['close'],
});

export const BusinessConfigSchema = z.object({
  businessName: z.string().min(2, 'Business name is required').max(100),
  publicContactPhone: z.string().min(5, 'Valid phone number is required'),
  publicContactEmail: z.string().email('Valid email address required'),
  timezone: z.string().min(1, 'Timezone is required'),
  currency: z.string().length(3, 'Currency must be 3-letter ISO code e.g. USD, EUR, GBP'),
  minNoticeHours: z.number().int().min(0).max(168, 'Notice cannot exceed 7 days'),
  maxHorizonDays: z.number().int().min(1).max(365, 'Booking horizon cannot exceed 365 days'),
  cancellationPolicyHours: z.number().int().min(0).max(72, 'Cancellation policy cannot exceed 72 hours'),
  tone: z.enum(['professional', 'friendly', 'concise']),
  requireHumanApprovalForBookings: z.boolean(),
});

export type BusinessConfigFormData = z.infer<typeof BusinessConfigSchema>;

export const InviteMemberSchema = z.object({
  email: z.string().email('Must provide a valid email'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.enum(['owner', 'manager', 'operator']),
});

export type InviteMemberFormData = z.infer<typeof InviteMemberSchema>;
