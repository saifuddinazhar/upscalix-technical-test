import { HttpError } from "../../commons/classes/http-error";
import timeEngine from "../engines/time-engine";
import Manager from "./manager";
import { UserDateTypeEnum } from "../../commons/enums/user-date-type-enum";
import notificationEngine from "../engines/notification-engine";
import moment from "moment";
import settingEngine from "../engines/setting-engine";


export default new class UserManager extends Manager {
  async getUserById(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: {id: userId},
      include: {
        userDates: true,
      }
    });
    if(!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  }

  async createUser(user: {firstName: string, lastName: string, email: string, location: string, dates?: { date: Date, type: UserDateTypeEnum }[] | undefined}) {
    const isEmailExist = await this.prisma.user.findFirst({where: {email: user.email}});
    if(isEmailExist) {
      throw new HttpError(400, "Email already exist");
    }
    const result = await this.prisma.$transaction(async (prisma) => {
      const userJson = { ...user, dates: undefined }
      const newUser = await prisma.user.create({data: userJson});
      if(user.dates && user.dates.length > 0) {
        for(const userDate of user.dates) {
          await prisma.userDate.create({data: {
            userId: newUser.id,
            dateType: Number(userDate.type.toString()),
            date: userDate.date,
          }});
        }
      }
      
      return newUser;
    });
    
    return await this.getUserById(result.id);
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findFirst({where: {id}});
    if(!user) {
      throw new HttpError(404, "User not found");
    }
    await this.prisma.user.delete({where: {id}});
  }

  /**
   * Get users, when the date given in "date", the user's timezone is at the hour "hour" and the minute "minute"
   * @param hour 
   * @param minute 
   * @param date given date, null is current date
   * @returns 
   */
  async getUsersAtGivenTimeAtUserTimezone(hour: number, minute: number, date?: Date | undefined) {
    const timezoneLocations = timeEngine.findTimezoneAtGivenTime(hour, minute, date);
    const users = await this.prisma.user.findMany({
      where: {
        location: {
          in: timezoneLocations
        },
        userDates: {
          some: { dateType: UserDateTypeEnum.Birthday }
        },
      },
      include: {
        userDates: true,
      }
    });

    const resultUsers = [];
    for(const user of users) {
      const birthdayDate = user.userDates.find(ud => ud.dateType === UserDateTypeEnum.Birthday);
      if(birthdayDate) {
        const currentTimeInUserTimezone = moment().tz(user.location);
        if(currentTimeInUserTimezone.day() == birthdayDate.date.getDay() && currentTimeInUserTimezone.month() == birthdayDate.date.getMonth()) {
          resultUsers.push(user);
        }
      }
    }
    return resultUsers;
  }

  /**
   * Get users where the user's time (at user's timezone) is at given "hour" and "minute"
   * @param hour 
   * @param minute 
   * @param date given date, null is current date
   * @returns 
   */
  async getUserToSendBirthdayMessages(hour: number, minute: number) {
    const lastSendBirthdayMessage = await settingEngine.getSettingDate("lastSendBirthdayMessage", undefined);
    await settingEngine.setSettingDate("lastSendBirthdayMessage", new Date());

    if(!lastSendBirthdayMessage) {
      const users = await this.getUsersAtGivenTimeAtUserTimezone(hour, minute);
      return users; 
    } else {
      const lastSendTime = moment(lastSendBirthdayMessage);
      const currentTime = moment();

      let allUsers = [];
      for(let time = lastSendTime.add('30', 'minute'); time.isSameOrBefore(currentTime); time.add('30', 'minute')) {
        const users = await this.getUsersAtGivenTimeAtUserTimezone(hour, minute, time.toDate());
        allUsers.push(...users);
      }
      return allUsers;
    }    
  }

  async sendBirthdayMessages(hour: number, minute: number) {
    const users = await this.getUserToSendBirthdayMessages(hour, minute);
    for(const user of users) {
      const message = `Hey, ${user.firstName} ${user.lastName} it's your birthday`;
      await notificationEngine.addNotificationToQueue(process.env.EMAIL_SERVICE_URL as string, user.email, message);
    } 
  } 
}