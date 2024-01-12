import { UserDateTypeEnum } from './../../src/commons/enums/user-date-type-enum';
import { PrismaClient } from "@prisma/client";
import moment from "moment-timezone";
import userManager from "../../src/business-logic/managers/user-manager";
import timeEngine from "../../src/business-logic/engines/time-engine";
import settingEngine from '../../src/business-logic/engines/setting-engine';

beforeEach(async () => {
  const prisma = new PrismaClient();
  await prisma.userDate.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();
});


test('Get users to send birthday message', async () => {
  const currentDateTime = moment();
  const currentTimeZone = timeEngine.findTimezoneAtGivenTime(currentDateTime.hour(), currentDateTime.minute())[0];
  const currentDateTimePlus1H = moment().add(1, 'hour');
  const currentTimeZonePlus1H = timeEngine.findTimezoneAtGivenTime(currentDateTimePlus1H.hour(), currentDateTimePlus1H.minute())[0];
  
  const prisma = new PrismaClient();

  // User 1 (valid birthday, valid timezone)
  const user1 = await prisma.user.create({
    data: {
      firstName: 'User1',
      lastName: 'Test',
      email: 'user1test@email.com',
      location: currentTimeZone
    }
  })

  await prisma.userDate.create({
    data: {
      userId: user1.id,
      dateType: UserDateTypeEnum.Birthday,
      date: currentDateTime.toDate(),
    }
  })

  // User 2 (valid birthday, wrong timezone)
  const user2 = await prisma.user.create({
    data: {
      firstName: 'User2',
      lastName: 'Test',
      email: 'user2test@email.com',
      location: currentTimeZonePlus1H
    }
  })

  await prisma.userDate.create({
    data: {
      userId: user2.id,
      dateType: UserDateTypeEnum.Birthday,
      date: currentDateTime.toDate(),
    }
  })

  //User 3 (wrong birthday, valid timezone)
  const user3 = await prisma.user.create({
    data: {
      firstName: 'User3',
      lastName: 'Test',
      email: 'user3test@email.com',
      location: currentTimeZone
    }
  })

  await prisma.userDate.create({
    data: {
      userId: user3.id,
      dateType: UserDateTypeEnum.Birthday,
      date: moment().add(1, 'day').toDate(),
    }
  })

  const userToSendBirthdayMessages = await userManager.getUsersAtGivenTimeAtUserTimezone(currentDateTime.hour(), currentDateTime.minute());
  expect(userToSendBirthdayMessages.length).toBe(1);
  expect((userToSendBirthdayMessages[0] as any).id).toBe(user1.id);
});


test('Recover unsent message', async () => {
  //Moment and timezone
  const currentDateTime = moment();
  const currentTimeZone = timeEngine.findTimezoneAtGivenTime(currentDateTime.hour(), currentDateTime.minute())[0];
  const currentDateTimeMin1H = moment().add(1, 'hour');
  const currentTimeZoneMin1H = timeEngine.findTimezoneAtGivenTime(currentDateTimeMin1H.hour(), currentDateTimeMin1H.minute())[0];
  const currentDateTimeMin2H = moment().add(2, 'hour');
  const currentTimeZoneMin2H = timeEngine.findTimezoneAtGivenTime(currentDateTimeMin2H.hour(), currentDateTimeMin2H.minute())[0];
  

  //Data initialization
  const prisma = new PrismaClient();

  //User current timezone
  const user1 = await prisma.user.create({
    data: {
      firstName: 'User1',
      lastName: 'Test',
      email: 'user1test@email.com',
      location: currentTimeZone
    }
  })

  await prisma.userDate.create({
    data: {
      userId: user1.id,
      dateType: UserDateTypeEnum.Birthday,
      date: currentDateTime.toDate(),
    }
  });

  //User -1H timezone
  const user2 = await prisma.user.create({
    data: {
      firstName: 'User2',
      lastName: 'Test',
      email: 'user2test@email.com',
      location: currentTimeZoneMin1H
    }
  })

  await prisma.userDate.create({
    data: {
      userId: user2.id,
      dateType: UserDateTypeEnum.Birthday,
      date: currentDateTime.toDate(),
    }
  });

  //User -2H timezone
  const user3 = await prisma.user.create({
    data: {
      firstName: 'User3',
      lastName: 'Test',
      email: 'user3test@email.com',
      location: currentTimeZoneMin2H
    }
  })

  await prisma.userDate.create({
    data: {
      userId: user3.id,
      dateType: UserDateTypeEnum.Birthday,
      date: currentDateTime.toDate(),
    }
  });

  //test
  const users = await userManager.getUserToSendBirthdayMessages(currentDateTime.hour(), currentDateTime.minute());
  expect(users.length).toBe(1);
  expect((users[0] as any).id).toBe(user1.id);
});


test('Recover unsent message', async () => {
  //Last last send message 2 hour  ago
  settingEngine.setSettingDate("lastSendBirthdayMessage", moment().add('-2', 'hour').toDate());

  //Moment and timezone
  const currentDateTime = moment();
  const currentTimeZone = timeEngine.findTimezoneAtGivenTime(currentDateTime.hour(), currentDateTime.minute())[0];
  const currentDateTimeMin1H = moment().add(1, 'hour');
  const currentTimeZoneMin1H = timeEngine.findTimezoneAtGivenTime(currentDateTimeMin1H.hour(), currentDateTimeMin1H.minute())[0];
  const currentDateTimeMin2H = moment().add(2, 'hour');
  const currentTimeZoneMin2H = timeEngine.findTimezoneAtGivenTime(currentDateTimeMin2H.hour(), currentDateTimeMin2H.minute())[0];
  

  //Data initialization
  const prisma = new PrismaClient();

  //User current timezone
  const user1 = await prisma.user.create({
    data: {
      firstName: 'User1',
      lastName: 'Test',
      email: 'user1test@email.com',
      location: currentTimeZone
    }
  })

  await prisma.userDate.create({
    data: {
      userId: user1.id,
      dateType: UserDateTypeEnum.Birthday,
      date: currentDateTime.toDate(),
    }
  });

  //User -1H timezone
  const user2 = await prisma.user.create({
    data: {
      firstName: 'User2',
      lastName: 'Test',
      email: 'user2test@email.com',
      location: currentTimeZoneMin1H
    }
  })

  await prisma.userDate.create({
    data: {
      userId: user2.id,
      dateType: UserDateTypeEnum.Birthday,
      date: currentDateTime.toDate(),
    }
  });

  //User -2H timezone
  const user3 = await prisma.user.create({
    data: {
      firstName: 'User3',
      lastName: 'Test',
      email: 'user3test@email.com',
      location: currentTimeZoneMin2H
    }
  })

  await prisma.userDate.create({
    data: {
      userId: user3.id,
      dateType: UserDateTypeEnum.Birthday,
      date: currentDateTime.toDate(),
    }
  });

  //test
  const users = await userManager.getUserToSendBirthdayMessages(currentDateTime.hour(), currentDateTime.minute());
  expect(users.length).toBe(2);
  expect((users[0] as any).id).toBe(user2.id);
  expect((users[1] as any).id).toBe(user1.id);
});
