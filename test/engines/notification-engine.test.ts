import { Prisma, PrismaClient } from "@prisma/client";
import notificationEngine from "../../src/business-logic/engines/notification-engine";
import notificationManager from "../../src/business-logic/managers/notification-manager";
import { NotificationStatusEnum } from "../../src/commons/enums/notification-status-enum";

const emailServerUrl = "http://birthday123.free.beeceptor.com";
const emailSereverWrongUrl = "http://localhost/api/xxx";

beforeEach(async () => {
  const prisma = new PrismaClient();
  await prisma.notification.deleteMany();
  await prisma.notification.deleteMany();
});

test('Send notification', async () => {
  await notificationEngine.addNotificationToQueue(emailServerUrl, "user@email.com", "Hello world");
  const prisma = new PrismaClient();
  const notificationCount = await prisma.notification.count({
    where: {
      status: NotificationStatusEnum.Pending
    }
  });
  expect(notificationCount).toBe(1);
});

test('Send notification to email server', async () => {
  await notificationEngine.addNotificationToQueue(emailServerUrl, "user@email.com", "Hello world");
  await notificationManager.sendAllNotificationsInQueue();
  const prisma = new PrismaClient();
  const notificationCountPending = await prisma.notification.count({
    where: {
      status: NotificationStatusEnum.Pending
    }
  });
  expect(notificationCountPending).toBe(0);
  
  const notificationCountSent = await prisma.notification.count({
    where: {
      status: NotificationStatusEnum.Sent
    }
  });
  expect(notificationCountSent).toBe(1);
});

test('Send notification to wrong url', async () => {
  await notificationEngine.addNotificationToQueue(emailSereverWrongUrl, "user@email.com", "Hello world");
  await notificationManager.sendAllNotificationsInQueue();
  const prisma = new PrismaClient();
  const notificationCountPending = await prisma.notification.count({
    where: {
      status: NotificationStatusEnum.Pending
    }
  });
  expect(notificationCountPending).toBe(0);
  
  const notificationCountSent = await prisma.notification.count({
    where: {
      status: NotificationStatusEnum.Fail
    }
  });
  expect(notificationCountSent).toBe(1);
});
