-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Font" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "previewText" TEXT NOT NULL,
    "preview" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Font" ("category", "createdAt", "id", "isPremium", "name", "previewText", "url") SELECT "category", "createdAt", "id", "isPremium", "name", "previewText", "url" FROM "Font";
DROP TABLE "Font";
ALTER TABLE "new_Font" RENAME TO "Font";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
