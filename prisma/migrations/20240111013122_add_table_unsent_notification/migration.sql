-- CreateTable
CREATE TABLE "UnsentNotification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "notificationType" INTEGER NOT NULL,
    CONSTRAINT "UnsentNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
