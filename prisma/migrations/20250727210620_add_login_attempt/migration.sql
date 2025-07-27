-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "sentBy" INTEGER;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_sentBy_fkey" FOREIGN KEY ("sentBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
