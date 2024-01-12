/*
  Warnings:

  - You are about to alter the column `dateType` on the `UserDate` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserDate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "dateType" INTEGER NOT NULL,
    CONSTRAINT "UserDate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserDate" ("date", "dateType", "id", "userId") SELECT "date", "dateType", "id", "userId" FROM "UserDate";
DROP TABLE "UserDate";
ALTER TABLE "new_UserDate" RENAME TO "UserDate";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
