/**
 * Centralized status mappings for issues, jobs, and dispatches.
 *
 * Every display label, badge color, dashboard grouping, and microcopy
 * lives here so the UI can never drift between pages.
 */

// ─── Issue Status ────────────────────────────────────────────

export const ISSUE_STATUS_LABELS: Record<string, string> = {
  new: 'New',
  classified: 'Ready to Send',
  awaiting_dispatch: 'Ready to Send',
  awaiting_quotes: 'Awaiting Quotes',
  quotes_received: 'Quotes Received',
  active_job: 'Active Job',
  completed: 'Completed',
  canceled: 'Canceled',
  archived: 'Archived',
};

export const ISSUE_STATUS_COLORS: Record<string, string> = {
  new: 'border-slate-200 bg-slate-50 text-slate-700',
  classified: 'border-blue-200 bg-blue-50 text-blue-700',
  awaiting_dispatch: 'border-blue-200 bg-blue-50 text-blue-700',
  awaiting_quotes: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  quotes_received: 'border-green-200 bg-green-50 text-green-700',
  active_job: 'border-blue-200 bg-blue-50 text-blue-700',
  completed: 'border-green-200 bg-green-50 text-green-700',
  canceled: 'border-slate-200 bg-slate-50 text-slate-700',
  archived: 'border-slate-200 bg-slate-50 text-slate-700',
};

export const ISSUE_NEXT_ACTION: Record<string, string> = {
  new: 'Classify this issue to get started',
  classified: 'Send to contractors for quotes',
  awaiting_dispatch: 'Send to contractors for quotes',
  awaiting_quotes: 'Waiting for contractor responses',
  quotes_received: 'Review quotes and select a contractor',
  active_job: 'Track scheduling and progress',
  completed: 'Job complete',
};

/** Centralized issue lifecycle — the ONLY source of truth for allowed transitions */
export const ISSUE_VALID_TRANSITIONS: Record<string, string[]> = {
  new: ['classified', 'quotes_received', 'canceled', 'completed'],
  classified: ['awaiting_quotes', 'quotes_received', 'canceled', 'completed'],
  awaiting_dispatch: ['awaiting_quotes', 'quotes_received', 'canceled', 'completed'],
  awaiting_quotes: ['quotes_received', 'canceled', 'completed'],
  quotes_received: ['active_job', 'awaiting_quotes', 'canceled', 'completed', 'archived'],
  active_job: ['completed', 'canceled', 'awaiting_dispatch', 'awaiting_quotes', 'quotes_received'],
  completed: ['archived'],
  canceled: ['archived'],
  archived: [],
};

/** Check if a status transition is allowed */
export function isIssueTransitionAllowed(from: string, to: string): boolean {
  return (ISSUE_VALID_TRANSITIONS[from] ?? []).includes(to);
}

/** Statuses considered "open" for dashboard / filtering */
export const OPEN_ISSUE_STATUSES = [
  'new',
  'classified',
  'awaiting_dispatch',
  'awaiting_quotes',
  'quotes_received',
  'active_job',
] as const;

/** View tab → status filter mapping for the issues list */
export const VIEW_STATUS_MAP = {
  all: undefined,
  open: [...OPEN_ISSUE_STATUSES],
  awaiting_quotes: ['awaiting_quotes'],
  quotes_received: ['quotes_received'],
  active_jobs: ['active_job'],
  completed: ['completed'],
  canceled: ['canceled'],
  archived: ['archived'],
} as const;

export type IssueView = keyof typeof VIEW_STATUS_MAP;

export const VIEW_LABELS: Record<string, string> = {
  all: 'All',
  open: 'Open',
  awaiting_quotes: 'Awaiting Quotes',
  quotes_received: 'Quotes Received',
  active_jobs: 'Active Jobs',
  completed: 'Completed',
  canceled: 'Canceled',
  archived: 'Archived',
};

/** Status options for the edit-issue form */
export const ISSUE_STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'classified', label: 'Classified' },
  { value: 'awaiting_dispatch', label: 'Awaiting Dispatch' },
  { value: 'awaiting_quotes', label: 'Awaiting Quotes' },
  { value: 'quotes_received', label: 'Quotes Received' },
  { value: 'active_job', label: 'Active Job' },
  { value: 'completed', label: 'Completed' },
  { value: 'canceled', label: 'Canceled' },
  { value: 'archived', label: 'Archived' },
] as const;

// ─── Job Status ──────────────────────────────────────────────

export const JOB_STATUS_LABELS: Record<string, string> = {
  selected: 'Contractor Selected',
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
  canceled: 'Canceled',
};

export const JOB_STATUS_COLORS: Record<string, string> = {
  selected: 'bg-blue-100 text-blue-800',
  scheduled: 'bg-indigo-100 text-indigo-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  canceled: 'bg-gray-100 text-gray-600',
};

export const JOB_STATUS_MICROCOPY: Record<string, string> = {
  selected: 'Contractor notified — waiting for their confirmation',
  scheduled: 'Work has been scheduled',
  in_progress: 'Work is currently underway',
  completed: 'Work finished',
  canceled: 'This job was canceled',
};

/** Progression steps for the job progress bar */
export const JOB_PROGRESS_STEPS = [
  'selected',
  'scheduled',
  'in_progress',
  'completed',
] as const;

/** Valid job status transitions (server-side guard) */
export const JOB_VALID_TRANSITIONS: Record<string, string[]> = {
  selected: ['scheduled', 'in_progress', 'canceled'],
  scheduled: ['in_progress', 'canceled'],
  in_progress: ['completed', 'canceled'],
  completed: [],
  canceled: [],
};

// ─── Dispatch Status ─────────────────────────────────────────

export const DISPATCH_STATUS_LABELS: Record<string, string> = {
  queued: 'Queued',
  sent: 'Sent',
  delivered: 'Delivered',
  failed: 'Failed',
  replied: 'Replied',
  accepted: 'Accepted',
  closed: 'Closed',
  expired: 'Expired',
};

export const DISPATCH_STATUS_COLORS: Record<string, string> = {
  accepted: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-600',
  replied: 'bg-blue-100 text-blue-800',
  failed: 'bg-red-100 text-red-800',
  sent: '',
  delivered: '',
  queued: '',
  expired: 'bg-gray-100 text-gray-600',
};

// ─── Urgency ─────────────────────────────────────────────────

export const URGENCY_LABELS: Record<string, string> = {
  emergency: 'Emergency',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const URGENCY_COLORS: Record<string, string> = {
  emergency: 'border-red-200 bg-red-50 text-red-700',
  high: 'border-orange-200 bg-orange-50 text-orange-700',
  medium: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  low: 'border-green-200 bg-green-50 text-green-700',
};

// ─── Category ────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<string, string> = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  hvac: 'HVAC',
  roofing: 'Roofing',
  appliance: 'Appliance',
  structural: 'Structural',
  pest: 'Pest',
  cleaning: 'Cleaning',
  exterior: 'Exterior',
  general_handyman: 'General Handyman',
  unknown: 'Unknown',
};

// ─── Helper functions ────────────────────────────────────────

/** Get issue status display label */
export function getIssueStatusLabel(status: string): string {
  return ISSUE_STATUS_LABELS[status] || status;
}

/** Get issue status badge color classes */
export function getIssueStatusColor(status: string): string {
  return ISSUE_STATUS_COLORS[status] ?? 'border-slate-200 bg-slate-50 text-slate-700';
}

/** Get urgency badge color classes */
export function getUrgencyColor(urgency: string | null): string {
  return URGENCY_COLORS[urgency ?? ''] ?? 'border-slate-200 bg-slate-50 text-slate-700';
}

/** Get urgency display label */
export function getUrgencyLabel(urgency: string | null): string {
  if (!urgency) return 'Unknown';
  return URGENCY_LABELS[urgency] || urgency.charAt(0).toUpperCase() + urgency.slice(1);
}

/** Get category display label */
export function getCategoryLabel(category: string | null): string {
  if (!category) return 'Unknown';
  return CATEGORY_LABELS[category.toLowerCase()] ||
    category.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/** Format internal snake_case values into readable labels */
export function formatLabel(value: string): string {
  const special: Record<string, string> = {
    hvac: 'HVAC',
    immediately: 'Immediately',
    today: 'Today',
    within_24_hours: 'Within 24 hours',
    within_48_hours: 'Within 48 hours',
    within_2_to_3_days: 'Within 2–3 days',
    within_1_week: 'Within 1 week',
    within_2_weeks: 'Within 2 weeks',
    within_1_month: 'Within 1 month',
    not_urgent: 'Not urgent',
    general_handyman: 'General Handyman',
    general_contractor: 'General Contractor',
    appliance_repair: 'Appliance Repair',
    pest_control: 'Pest Control',
  };
  if (special[value.toLowerCase()]) return special[value.toLowerCase()];
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Check if an issue status is "open" */
export function isIssueOpen(status: string): boolean {
  return (OPEN_ISSUE_STATUSES as readonly string[]).includes(status);
}

/** Get dispatch status label */
export function getDispatchStatusLabel(status: string): string {
  return DISPATCH_STATUS_LABELS[status] || 'Queued';
}

/** Get dispatch status badge color classes */
export function getDispatchStatusColor(status: string): string {
  return DISPATCH_STATUS_COLORS[status] ?? '';
}
