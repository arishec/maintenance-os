-- Add issue.reference column
-- Step 1: Add as nullable
ALTER TABLE "Issue" ADD COLUMN IF NOT EXISTS "reference" TEXT;

-- Step 2: Backfill existing issues with generated references
-- Uses random 6-char tokens from safe character set
UPDATE "Issue"
SET "reference" = 'ISS-' || substr(
  replace(replace(replace(replace(
    upper(encode(gen_random_bytes(6), 'hex')),
    '0', 'G'), '1', 'H'), 'O', 'J'), 'I', 'K'),
  1, 6)
WHERE "reference" IS NULL;

-- Step 3: Make NOT NULL and add unique index
ALTER TABLE "Issue" ALTER COLUMN "reference" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "Issue_reference_key" ON "Issue"("reference");
