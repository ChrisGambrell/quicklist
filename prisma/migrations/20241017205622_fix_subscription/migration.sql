-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "metadata" JSONB,
ALTER COLUMN "endedAt" DROP NOT NULL,
ALTER COLUMN "endedAt" DROP DEFAULT,
ALTER COLUMN "cancelAt" DROP NOT NULL,
ALTER COLUMN "cancelAt" DROP DEFAULT,
ALTER COLUMN "canceledAt" DROP NOT NULL,
ALTER COLUMN "canceledAt" DROP DEFAULT,
ALTER COLUMN "trialStart" DROP NOT NULL,
ALTER COLUMN "trialStart" DROP DEFAULT,
ALTER COLUMN "trialEnd" DROP NOT NULL,
ALTER COLUMN "trialEnd" DROP DEFAULT;
