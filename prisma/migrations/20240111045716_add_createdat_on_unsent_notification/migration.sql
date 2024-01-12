-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UnsentNotification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apiUrl" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_UnsentNotification" ("apiUrl", "email", "id", "message", "statusCode") SELECT "apiUrl", "email", "id", "message", "statusCode" FROM "UnsentNotification";
DROP TABLE "UnsentNotification";
ALTER TABLE "new_UnsentNotification" RENAME TO "UnsentNotification";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
