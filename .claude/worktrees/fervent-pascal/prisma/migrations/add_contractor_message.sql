-- Create MessageDirection enum type
DO $$ BEGIN
  CREATE TYPE "MessageDirection" AS ENUM ('inbound', 'outbound');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create ContractorMessage table for tracking outbound replies to contractors
CREATE TABLE IF NOT EXISTS "ContractorMessage" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "issueId" TEXT NOT NULL,
  "contractorId" TEXT NOT NULL,
  "contractorResponseId" TEXT,
  "direction" "MessageDirection" NOT NULL,
  "channel" "DispatchChannel" NOT NULL,
  "messageBody" TEXT NOT NULL,
  "providerMessageId" TEXT,
  "sendStatus" TEXT NOT NULL DEFAULT 'sent',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ContractorMessage_pkey" PRIMARY KEY ("id")
);

-- Foreign keys
ALTER TABLE "ContractorMessage" ADD CONSTRAINT "ContractorMessage_issueId_fkey"
  FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ContractorMessage" ADD CONSTRAINT "ContractorMessage_contractorId_fkey"
  FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ContractorMessage" ADD CONSTRAINT "ContractorMessage_contractorResponseId_fkey"
  FOREIGN KEY ("contractorResponseId") REFERENCES "ContractorResponse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS "ContractorMessage_issueId_contractorId_createdAt_idx"
  ON "ContractorMessage"("issueId", "contractorId", "createdAt");

CREATE INDEX IF NOT EXISTS "ContractorMessage_contractorResponseId_idx"
  ON "ContractorMessage"("contractorResponseId");
