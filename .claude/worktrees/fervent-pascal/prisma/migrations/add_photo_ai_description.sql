-- Add AI description field to IssuePhoto for vision-based photo analysis
ALTER TABLE "IssuePhoto" ADD COLUMN "aiDescription" TEXT;
