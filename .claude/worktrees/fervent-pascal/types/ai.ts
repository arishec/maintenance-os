import { z } from 'zod';

export const issueClassificationSchema = z.object({
  title: z.string().min(1),
  category: z.enum([
    'plumbing',
    'electrical',
    'hvac',
    'roofing',
    'appliance',
    'structural',
    'pest',
    'cleaning',
    'exterior',
    'general_handyman',
    'unknown',
  ]),
  urgency: z.enum(['emergency', 'high', 'medium', 'low']),
  reasoningSummary: z.string().min(1),
  suggestedTimeframe: z.enum([
    'immediately',
    'today',
    'within_24_hours',
    'within_2_to_3_days',
    'within_1_week',
  ]),
  recommendedTrade: z.enum([
    'plumbing',
    'electrical',
    'hvac',
    'roofing',
    'appliance_repair',
    'handyman',
    'pest_control',
    'landscaping',
    'cleaning',
    'restoration',
    'general_contractor',
    'other',
  ]),
  confidenceScore: z.number().min(0).max(1),
});

export const contractorReplySchema = z.object({
  availabilityText: z.string().nullable(),
  availabilityDate: z.string().nullable(),
  estimateLow: z.number().nullable(),
  estimateHigh: z.number().nullable(),
  flatEstimate: z.number().nullable(),
  notes: z.string().nullable(),
  followUpQuestion: z.string().nullable(),
  confidenceScore: z.number().min(0).max(1),
  requiresReview: z.boolean(),
});

export type IssueClassification = z.infer<typeof issueClassificationSchema>;
export type ContractorReplyParse = z.infer<typeof contractorReplySchema>;
