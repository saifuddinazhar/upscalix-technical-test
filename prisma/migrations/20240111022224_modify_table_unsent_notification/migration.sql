/*
  Warnings:

  - You are about to drop the column `notificationType` on the `UnsentNotification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UnsentNotification` table. All the data in the column will be lost.
  - Added the required column `apiUrl` to the `UnsentNotification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `UnsentNotification` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UnsentNotification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apiUrl" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL
);
INSERT INTO "new_UnsentNotification" ("id", "message", "statusCode") SELECT "id", "message", "statusCode" FROM "UnsentNotification";
DROP TABLE "UnsentNotification";
ALTER TABLE "new_UnsentNotification" RENAME TO "UnsentNotification";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
