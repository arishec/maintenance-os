import { prisma } from '@/lib/prisma';

const STALE_THRESHOLD_HOURS = 72;

// ─── Types ──────────────────────────────────────────────────────────

export interface AttentionItem {
  issueId: string;
  issueTitle: string;
  propertyName: string;
  reason: string;
  actionLabel: string;
  actionHref: string;
  urgency: 'high' | 'medium' | 'low';
  timestamp: Date;
}

export interface ScheduledTodayItem {
  jobId: string;
  issueId: string;
  issueTitle: string;
  propertyName: string;
  contractorName: string;
  companyName: string | null;
  scheduledFor: Date;
}

export interface WaitingItem {
  issueId: string;
  issueTitle: string;
  propertyName: string;
  contractorsContacted: number;
  oldestDispatchAt: Date;
}

export interface ActivityItem {
  id: string;
  eventType: string;
  description: string;
  issueId: string | null;
  issueTitle: string | null;
  timestamp: Date;
  count: number;
}

export interface OverviewCounts {
  openIssues: number;
  quotesReady: number;
  activeJobs: number;
  completedThisMonth: number;
  properties: number;
}

// ─── Helpers ────────────────────────────────────────────────────────

export async function getNeedsAttentionItems(userId: string): Promise<AttentionItem[]> {
  const items: AttentionItem[] = [];

  // Get all user properties
  const properties = await prisma.property.findMany({
    where: { ownerUserId: userId },
    select: { id: true, nickname: true, addressLine1: true },
  });
  const propertyIds = properties.map((p) => p.id);
  const propertyMap = new Map(properties.map((p) => [p.id, p.nickname || p.addressLine1]));

  if (propertyIds.length === 0) return items;

  // 1. Issues with quotes_received — user needs to review/select
  const quotesReady = await prisma.issue.findMany({
    where: { propertyId: { in: propertyIds }, status: 'quotes_received' },
    select: { id: true, title: true, propertyId: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  });
  for (const issue of quotesReady) {
    items.push({
      issueId: issue.id,
      issueTitle: issue.title ?? 'Untitled issue',
      propertyName: propertyMap.get(issue.propertyId) ?? '',
      reason: 'Contractor sent a quote — pick a contractor or request more',
      actionLabel: 'Review quotes',
      actionHref: `/issues/${issue.id}`,
      urgency: 'high',
      timestamp: issue.updatedAt,
    });
  }

  // 2. Contractor asked a question (has followUpQuestion, no outbound reply after it)
  const issuesWithQuestions = await prisma.issue.findMany({
    where: {
      propertyId: { in: propertyIds },
      status: { notIn: ['completed', 'canceled', 'archived'] },
      dispatches: {
        some: {
          responses: {
            some: { followUpQuestion: { not: null } },
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
      propertyId: true,
      dispatches: {
        select: {
          contractorId: true,
          contractor: { select: { name: true } },
          responses: {
            where: { followUpQuestion: { not: null } },
            select: { id: true, followUpQuestion: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      },
    },
  });

  // Batch-fetch all outbound replies for issues with questions (avoids N+1)
  const questionIssueIds = issuesWithQuestions.map((i) => i.id);
  const allOutboundReplies = questionIssueIds.length > 0
    ? await prisma.contractorMessage.findMany({
        where: {
          issueId: { in: questionIssueIds },
          direction: 'outbound',
        },
        select: { issueId: true, contractorId: true, createdAt: true },
      })
    : [];

  for (const issue of issuesWithQuestions) {
    // Only show one question per issue (the most recent unanswered one)
    if (items.some((i) => i.issueId === issue.id)) continue;

    let latestQuestion: { name: string; createdAt: Date } | null = null;
    for (const dispatch of issue.dispatches) {
      const question = dispatch.responses[0];
      if (!question) continue;

      // Check if there's an outbound reply after this question (from batch)
      const hasReply = allOutboundReplies.some(
        (r) => r.issueId === issue.id && r.contractorId === dispatch.contractorId && r.createdAt > question.createdAt
      );
      if (hasReply) continue;

      if (!latestQuestion || question.createdAt > latestQuestion.createdAt) {
        latestQuestion = { name: dispatch.contractor.name, createdAt: question.createdAt };
      }
    }

    if (latestQuestion) {
      items.push({
        issueId: issue.id,
        issueTitle: issue.title ?? 'Untitled issue',
        propertyName: propertyMap.get(issue.propertyId) ?? '',
        reason: `${latestQuestion.name} asked a question — waiting on your reply`,
        actionLabel: 'Reply now',
        actionHref: `/issues/${issue.id}`,
        urgency: 'high',
        timestamp: latestQuestion.createdAt,
      });
    }
  }

  // 3. Jobs selected but not scheduled (missing scheduledFor)
  const unscheduledJobs = await prisma.job.findMany({
    where: {
      issue: { propertyId: { in: propertyIds } },
      status: 'selected',
      scheduledFor: null,
    },
    select: {
      issueId: true,
      createdAt: true,
      issue: { select: { title: true, propertyId: true } },
    },
  });
  for (const job of unscheduledJobs) {
    if (items.some((i) => i.issueId === job.issueId)) continue;
    items.push({
      issueId: job.issueId,
      issueTitle: job.issue.title ?? 'Untitled issue',
      propertyName: propertyMap.get(job.issue.propertyId) ?? '',
      reason: 'Contractor selected — set a date so the work can begin',
      actionLabel: 'Schedule job',
      actionHref: `/issues/${job.issueId}`,
      urgency: 'medium',
      timestamp: job.createdAt,
    });
  }

  // 4. Stale dispatches — sent/delivered with no reply and older than threshold
  const staleThreshold = new Date(Date.now() - STALE_THRESHOLD_HOURS * 60 * 60 * 1000);
  const staleDispatches = await prisma.dispatch.findMany({
    where: {
      issue: { propertyId: { in: propertyIds }, status: { notIn: ['completed', 'canceled', 'archived'] } },
      status: { in: ['sent', 'delivered'] },
      createdAt: { lt: staleThreshold },
      responses: { none: {} },
    },
    select: {
      issueId: true,
      createdAt: true,
      contractor: { select: { name: true } },
      issue: { select: { title: true, propertyId: true } },
    },
  });
  for (const dispatch of staleDispatches) {
    if (items.some((i) => i.issueId === dispatch.issueId)) continue;
    const daysSince = Math.floor((Date.now() - dispatch.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    items.push({
      issueId: dispatch.issueId,
      issueTitle: dispatch.issue.title ?? 'Untitled issue',
      propertyName: propertyMap.get(dispatch.issue.propertyId) ?? '',
      reason: `Waiting ${daysSince} days — ${dispatch.contractor.name} hasn't replied`,
      actionLabel: 'Follow up',
      actionHref: `/issues/${dispatch.issueId}`,
      urgency: daysSince > 5 ? 'high' : 'medium',
      timestamp: dispatch.createdAt,
    });
  }

  // 4b. Scheduled jobs without a date — contractor confirmed but no date set yet
  const scheduledNeedsDate = await prisma.job.findMany({
    where: {
      issue: { propertyId: { in: propertyIds } },
      status: 'scheduled',
      scheduledFor: null,
    },
    select: {
      issueId: true,
      updatedAt: true,
      contractor: { select: { name: true } },
      issue: { select: { title: true, propertyId: true } },
    },
  });
  for (const job of scheduledNeedsDate) {
    if (items.some((i) => i.issueId === job.issueId)) continue;
    items.push({
      issueId: job.issueId,
      issueTitle: job.issue.title ?? 'Untitled issue',
      propertyName: propertyMap.get(job.issue.propertyId) ?? '',
      reason: `${job.contractor.name} confirmed — set a date to lock in the schedule`,
      actionLabel: 'Set date',
      actionHref: `/issues/${job.issueId}`,
      urgency: 'high',
      timestamp: job.updatedAt,
    });
  }

  // 5. Active jobs in progress — user should monitor / confirm completion
  const activeJobs = await prisma.job.findMany({
    where: {
      issue: { propertyId: { in: propertyIds } },
      status: 'in_progress',
    },
    select: {
      issueId: true,
      startedAt: true,
      createdAt: true,
      contractor: { select: { name: true } },
      issue: { select: { title: true, propertyId: true } },
    },
  });
  for (const job of activeJobs) {
    if (items.some((i) => i.issueId === job.issueId)) continue;
    const hoursSinceStart = Math.floor((Date.now() - (job.startedAt ?? job.createdAt).getTime()) / (1000 * 60 * 60));
    const daysSinceStart = Math.floor(hoursSinceStart / 24);
    const timeLabel = daysSinceStart > 0 ? `In progress ${daysSinceStart} day${daysSinceStart !== 1 ? 's' : ''}` : `In progress ${hoursSinceStart}h`;
    items.push({
      issueId: job.issueId,
      issueTitle: job.issue.title ?? 'Untitled issue',
      propertyName: propertyMap.get(job.issue.propertyId) ?? '',
      reason: `${timeLabel} with ${job.contractor.name} — check status or mark complete`,
      actionLabel: 'View job',
      actionHref: `/issues/${job.issueId}`,
      urgency: daysSinceStart > 3 ? 'medium' : 'low',
      timestamp: job.startedAt ?? job.createdAt,
    });
  }

  // 6. Scheduled jobs with a date — today or upcoming
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
  const scheduledWithDate = await prisma.job.findMany({
    where: {
      issue: { propertyId: { in: propertyIds } },
      status: 'scheduled',
      scheduledFor: { not: null },
    },
    select: {
      issueId: true,
      scheduledFor: true,
      contractor: { select: { name: true } },
      issue: { select: { title: true, propertyId: true } },
    },
  });
  for (const job of scheduledWithDate) {
    if (items.some((i) => i.issueId === job.issueId)) continue;
    const isToday = job.scheduledFor! >= startOfDay && job.scheduledFor! < endOfDay;
    const isFuture = job.scheduledFor! >= endOfDay;
    const dateStr = job.scheduledFor!.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    items.push({
      issueId: job.issueId,
      issueTitle: job.issue.title ?? 'Untitled issue',
      propertyName: propertyMap.get(job.issue.propertyId) ?? '',
      reason: isToday
        ? `${job.contractor.name} arriving today — be available or confirm access`
        : `${job.contractor.name} scheduled for ${dateStr} — track upcoming work`,
      actionLabel: isToday ? 'View details' : 'View job',
      actionHref: `/issues/${job.issueId}`,
      urgency: isToday ? 'high' : 'medium',
      timestamp: job.scheduledFor ?? now,
    });
  }

  // 7. High urgency issues still open — show status-specific guidance
  const highUrgencyIssues = await prisma.issue.findMany({
    where: {
      propertyId: { in: propertyIds },
      urgency: { in: ['high', 'emergency'] },
      status: { notIn: ['completed', 'canceled', 'archived', 'quotes_received'] },
    },
    select: { id: true, title: true, propertyId: true, status: true, urgency: true, createdAt: true },
  });
  for (const issue of highUrgencyIssues) {
    // Don't double-count if already in attention for another reason
    if (items.some((i) => i.issueId === issue.id)) continue;

    const priorityLabel = issue.urgency === 'emergency' ? 'Emergency' : 'High priority';
    let reason: string;
    let actionLabel: string;

    switch (issue.status) {
      case 'new':
      case 'classified':
        reason = `${priorityLabel} — needs to be sent to contractors`;
        actionLabel = 'Send to contractors';
        break;
      case 'awaiting_dispatch':
        reason = `${priorityLabel} — ready to dispatch to contractors`;
        actionLabel = 'Send to contractors';
        break;
      case 'awaiting_quotes':
        reason = `${priorityLabel} — waiting for contractor responses`;
        actionLabel = 'View status';
        break;
      case 'active_job':
        reason = `${priorityLabel} — job in progress, check status`;
        actionLabel = 'View job';
        break;
      default:
        reason = `${priorityLabel} — check job status`;
        actionLabel = 'View job';
        break;
    }

    items.push({
      issueId: issue.id,
      issueTitle: issue.title ?? 'Untitled issue',
      propertyName: propertyMap.get(issue.propertyId) ?? '',
      reason,
      actionLabel,
      actionHref: issue.status === 'classified' || issue.status === 'awaiting_dispatch'
        ? `/issues/${issue.id}/dispatch`
        : `/issues/${issue.id}`,
      urgency: 'high',
      timestamp: issue.createdAt,
    });
  }

  // 8. Unread notifications — surface what the user hasn't seen
  const unreadNotifications = await prisma.notification.findMany({
    where: { userId, readAt: null },
    select: {
      id: true,
      title: true,
      issueId: true,
      createdAt: true,
      issue: { select: { title: true, propertyId: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  for (const notif of unreadNotifications) {
    if (!notif.issueId) continue;
    // Don't double-count
    if (items.some((i) => i.issueId === notif.issueId)) continue;
    items.push({
      issueId: notif.issueId,
      issueTitle: notif.issue?.title ?? 'Untitled issue',
      propertyName: notif.issue?.propertyId ? (propertyMap.get(notif.issue.propertyId) ?? '') : '',
      reason: notif.title, // e.g. "Contractor confirmed the job"
      actionLabel: 'View',
      actionHref: `/issues/${notif.issueId}`,
      urgency: 'medium',
      timestamp: notif.createdAt,
    });
  }

  // 9. Completed jobs missing actual cost
  const missingCostJobs = await prisma.job.findMany({
    where: {
      issue: { propertyId: { in: propertyIds } },
      status: 'completed',
      actualCost: null,
    },
    select: {
      issueId: true,
      completedAt: true,
      issue: { select: { title: true, propertyId: true } },
    },
    orderBy: { completedAt: 'desc' },
    take: 5,
  });
  for (const job of missingCostJobs) {
    items.push({
      issueId: job.issueId,
      issueTitle: job.issue.title ?? 'Untitled issue',
      propertyName: propertyMap.get(job.issue.propertyId) ?? '',
      reason: 'Job done — record what you paid for your records',
      actionLabel: 'Add cost',
      actionHref: `/issues/${job.issueId}`,
      urgency: 'low',
      timestamp: job.completedAt ?? new Date(),
    });
  }

  // Sort: high urgency first, then by timestamp desc
  const urgencyOrder = { high: 0, medium: 1, low: 2 };
  items.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency] || b.timestamp.getTime() - a.timestamp.getTime());

  return items;
}

export async function getScheduledTodayItems(userId: string): Promise<ScheduledTodayItem[]> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  const properties = await prisma.property.findMany({
    where: { ownerUserId: userId },
    select: { id: true, nickname: true, addressLine1: true },
  });
  const propertyIds = properties.map((p) => p.id);
  const propertyMap = new Map(properties.map((p) => [p.id, p.nickname || p.addressLine1]));

  if (propertyIds.length === 0) return [];

  const jobs = await prisma.job.findMany({
    where: {
      issue: { propertyId: { in: propertyIds } },
      status: { in: ['scheduled', 'in_progress'] },
      scheduledFor: { gte: startOfDay, lt: endOfDay },
    },
    select: {
      id: true,
      issueId: true,
      scheduledFor: true,
      contractor: { select: { name: true, companyName: true } },
      issue: { select: { title: true, propertyId: true } },
    },
    orderBy: { scheduledFor: 'asc' },
  });

  return jobs.map((job) => ({
    jobId: job.id,
    issueId: job.issueId,
    issueTitle: job.issue.title ?? 'Untitled issue',
    propertyName: propertyMap.get(job.issue.propertyId) ?? '',
    contractorName: job.contractor.name,
    companyName: job.contractor.companyName,
    scheduledFor: job.scheduledFor!,
  }));
}

export async function getWaitingOnContractorsItems(userId: string): Promise<WaitingItem[]> {
  const staleThreshold = new Date(Date.now() - STALE_THRESHOLD_HOURS * 60 * 60 * 1000);

  const properties = await prisma.property.findMany({
    where: { ownerUserId: userId },
    select: { id: true, nickname: true, addressLine1: true },
  });
  const propertyIds = properties.map((p) => p.id);
  const propertyMap = new Map(properties.map((p) => [p.id, p.nickname || p.addressLine1]));

  if (propertyIds.length === 0) return [];

  const issues = await prisma.issue.findMany({
    where: {
      propertyId: { in: propertyIds },
      status: 'awaiting_quotes',
      dispatches: {
        some: {
          status: { in: ['sent', 'delivered'] },
          createdAt: { gte: staleThreshold }, // NOT stale yet
          responses: { none: {} },
        },
      },
      // Exclude issues that ALSO have stale dispatches (shown in attention list instead)
      NOT: {
        dispatches: {
          some: {
            status: { in: ['sent', 'delivered'] },
            createdAt: { lt: staleThreshold },
            responses: { none: {} },
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
      propertyId: true,
      dispatches: {
        where: { status: { in: ['sent', 'delivered'] }, responses: { none: {} } },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  return issues.map((issue) => ({
    issueId: issue.id,
    issueTitle: issue.title ?? 'Untitled issue',
    propertyName: propertyMap.get(issue.propertyId) ?? '',
    contractorsContacted: issue.dispatches.length,
    oldestDispatchAt: issue.dispatches[0]?.createdAt ?? new Date(),
  }));
}

export async function getRecentActivityItems(userId: string): Promise<ActivityItem[]> {
  const properties = await prisma.property.findMany({
    where: { ownerUserId: userId },
    select: { id: true },
  });
  const propertyIds = properties.map((p) => p.id);
  if (propertyIds.length === 0) return [];

  const events = await prisma.timelineEvent.findMany({
    where: {
      propertyId: { in: propertyIds },
      eventType: {
        in: [
          'contractor_replied',
          'contractor_confirmed',
          'contractor_declined',
          'owner_reply_sent',
          'contractor_selected',
          'job_completed',
          'job_scheduled',
          'job_canceled',
          'dispatch_sent',
          'issue_created',
        ],
      },
    },
    select: {
      id: true,
      eventType: true,
      issueId: true,
      createdAt: true,
      issue: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const eventDescriptions: Record<string, string> = {
    contractor_replied: 'Contractor replied',
    contractor_confirmed: 'Contractor confirmed the job',
    contractor_declined: 'Contractor declined the job',
    owner_reply_sent: 'You replied to contractor',
    contractor_selected: 'Contractor selected',
    job_completed: 'Job completed',
    job_canceled: 'Job canceled',
    job_scheduled: 'Job scheduled',
    dispatch_sent: 'Contractor contacted',
    issue_created: 'Issue reported',
  };

  // Group by eventType + issueId to reduce noise (e.g. "You replied 3 times" instead of 3 rows)
  const grouped = new Map<string, ActivityItem>();
  for (const e of events) {
    const key = `${e.eventType}::${e.issueId ?? 'none'}`;
    const existing = grouped.get(key);
    if (existing) {
      existing.count += 1;
      // Keep the most recent timestamp
      if (e.createdAt > existing.timestamp) existing.timestamp = e.createdAt;
    } else {
      grouped.set(key, {
        id: e.id,
        eventType: e.eventType,
        description: eventDescriptions[e.eventType] || e.eventType,
        issueId: e.issueId,
        issueTitle: e.issue?.title ?? null,
        timestamp: e.createdAt,
        count: 1,
      });
    }
  }

  return Array.from(grouped.values())
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export async function getOverviewCounts(userId: string): Promise<OverviewCounts> {
  const properties = await prisma.property.findMany({
    where: { ownerUserId: userId },
    select: { id: true },
  });
  const propertyIds = properties.map((p) => p.id);

  if (propertyIds.length === 0) {
    return { openIssues: 0, quotesReady: 0, activeJobs: 0, completedThisMonth: 0, properties: 0 };
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [openIssues, quotesReady, activeJobs, completedThisMonth] = await Promise.all([
    prisma.issue.count({
      where: { propertyId: { in: propertyIds }, status: { notIn: ['completed', 'canceled', 'archived'] } },
    }),
    prisma.issue.count({
      where: { propertyId: { in: propertyIds }, status: 'quotes_received' },
    }),
    prisma.issue.count({
      where: { propertyId: { in: propertyIds }, status: 'active_job' },
    }),
    prisma.issue.count({
      where: { propertyId: { in: propertyIds }, status: 'completed', completedAt: { gte: startOfMonth } },
    }),
  ]);

  return {
    openIssues,
    quotesReady,
    activeJobs,
    completedThisMonth,
    properties: propertyIds.length,
  };
}
