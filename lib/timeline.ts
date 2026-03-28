import { prisma } from '@/lib/prisma';

type ActorType = 'user' | 'tenant' | 'system' | 'contractor';

interface LogTimelineEventInput {
  propertyId: string;
  issueId?: string;
  jobId?: string;
  actorType: ActorType;
  actorLabel?: string;
  eventType: string;
  payload?: Record<string, unknown>;
}

export async function logTimelineEvent(input: LogTimelineEventInput) {
  return prisma.timelineEvent.create({
    data: {
      propertyId: input.propertyId,
      issueId: input.issueId,
      jobId: input.jobId,
      actorType: input.actorType,
      actorLabel: input.actorLabel,
      eventType: input.eventType,
      eventPayloadJson: input.payload ? JSON.parse(JSON.stringify(input.payload)) : undefined,
    },
  });
}
