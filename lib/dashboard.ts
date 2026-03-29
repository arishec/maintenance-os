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
      reason: 'Quotes ready to review',
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

  for (const issue of issuesWithQuestions) {
    for (const dispatch of issue.dispatches) {
      const question = dispatch.responses[0];
      if (!question) continue;

      // Check if there's already an outbound reply after this question
      const replyAfterQuestion = await prisma.contractorMessage.findFirst({
        where: {
          issueId: issue.id,
          contractorId: dispatch.contractorId,
          direction: 'outbound',
          createdAt: { gt: question.createdAt },
        },
      });
      if (replyAfterQuestion) continue;

      items.push({
        issueId: issue.id,
        issueTitle: issue.title ?? 'Untitled issue',
        propertyName: propertyMap.get(issue.propertyId) ?? '',
        reason: `${dispatch.contractor.name} asked a question`,
        actionLabel: 'Reply',
        actionHref: `/issues/${issue.id}`,
        urgency: 'high',
        timestamp: question.createdAt,
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
    items.push({
      issueId: job.issueId,
      issueTitle: job.issue.title ?? 'Untitled issue',
      propertyName: propertyMap.get(job.issue.propertyId) ?? '',
      reason: 'Job needs scheduling',
      actionLabel: 'Schedule',
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
    const daysSince = Math.floor((Date.now() - dispatch.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    items.push({
      issueId: dispatch.issueId,
      issueTitle: dispatch.issue.title ?? 'Untitled issue',
      propertyName: propertyMap.get(dispatch.issue.propertyId) ?? '',
      reason: `No response from ${dispatch.contractor.name} in ${daysSince} days`,
      actionLabel: 'Follow up',
      actionHref: `/issues/${dispatch.issueId}`,
      urgency: daysSince > 5 ? 'high' : 'medium',
      timestamp: dispatch.createdAt,
    });
  }

  // 5. Completed jobs missing actual cost
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
      reason: 'Completed — record actual cost',
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
          'owner_reply_sent',
          'contractor_selected',
          'job_completed',
          'job_scheduled',
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
    owner_reply_sent: 'You replied to contractor',
    contractor_selected: 'Contractor selected',
    job_completed: 'Job completed',
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
    prisma.job.count({
      where: {
        issue: { propertyId: { in: propertyIds } },
        status: { in: ['selected', 'scheduled', 'in_progress'] },
      },
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
