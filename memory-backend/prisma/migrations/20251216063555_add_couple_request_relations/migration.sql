-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CoupleRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CoupleRequest_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CoupleRequest_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CoupleRequest" ("createdAt", "fromUserId", "id", "toUserId") SELECT "createdAt", "fromUserId", "id", "toUserId" FROM "CoupleRequest";
DROP TABLE "CoupleRequest";
ALTER TABLE "new_CoupleRequest" RENAME TO "CoupleRequest";
CREATE UNIQUE INDEX "CoupleRequest_fromUserId_toUserId_key" ON "CoupleRequest"("fromUserId", "toUserId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
