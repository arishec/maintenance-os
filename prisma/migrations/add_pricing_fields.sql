-- Add pricing/plan fields to User table
-- Run this on the correct Supabase project: hzrsvulgncadxhwykmsd

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "plan" TEXT NOT NULL DEFAULT 'free';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "issueCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT UNIQUE;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" TEXT;
