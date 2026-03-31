-- Add closedReason to Dispatch for tracking why a dispatch was closed
-- Values: not_selected, expired, owner_canceled, late_reply
ALTER TABLE "Dispatch" ADD COLUMN "closedReason" TEXT;
